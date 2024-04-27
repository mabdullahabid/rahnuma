# code_review.py

import base64
import re
import traceback

from pull_request import pr, repo

from .bot import Bot
from .inputs import Inputs
from .options import OpenAIOptions, Options
from .prompts import Prompts

options = Options()
options.review_simple_changes = False
options.openai_light_model = "gpt-3.5-turbo-0125"

prompts = Prompts()

light_bot = None
try:
    light_bot = Bot(options, OpenAIOptions(options.openai_light_model, options.light_token_limits))
except Exception as e:
    # Assuming a function or method to log or print warnings
    print(f"Skipped: failed to create summary bot, please check your openai_api_key: {e}")
    traceback.print_exc()

heavy_bot = None
try:
    heavy_bot = Bot(options, OpenAIOptions(options.openai_heavy_model, options.heavy_token_limits))
except Exception as e:
    # Assuming a function or method to log or print warnings
    print(f"Skipped: failed to create summary bot, please check your openai_api_key: {e}")
    traceback.print_exc()


inputs = Inputs()
inputs.title = pr.title
inputs.description = pr.body

commits = [commit.sha for commit in pr.get_commits()]
print(f"commits: {commits}")

highest_reviewed_commit_id = pr.base.sha
print(f"highest_reviewed_commit_id: {highest_reviewed_commit_id}")

# Fetch the diff between the highest reviewed commit and the latest commit of the PR branch
incremental_diff = repo.compare(highest_reviewed_commit_id, pr.head.sha)
print(f"incremental_diff: {incremental_diff.diff_url}")

# Fetch the diff between the target branch's base commit and the latest commit of the PR branch
target_branch_diff = repo.compare(pr.base.sha, pr.head.sha)
print(f"target_branch_diff: {target_branch_diff.diff_url}")

incremental_files = incremental_diff.files
target_branch_files = target_branch_diff.files

if not incremental_files or not target_branch_files:
    print("Skipped: files data is missing")

# Filter out any file that is changed compared to the incremental changes
files = [
    target_branch_file
    for target_branch_file in target_branch_files
    if any(incremental_file.filename == target_branch_file.filename for incremental_file in incremental_files)
]
print(f"files: {files}")

if len(files) == 0:
    print("Skipped: files is null")

# skip files if they are filtered out
filter_selected_files = []
filter_ignored_files = []
for file in files:
    filter_selected_files.append(file)
print(f"filter_selected_files: {filter_selected_files}")

if len(filter_selected_files) == 0:
    print("Skipped: filter_selected_files is null")

commits = [commit for commit in incremental_diff.commits]
print(f"commits: {commits}")

if len(commits) == 0:
    print("Skipped: commits is null")


def split_patch(patch):
    if not patch:
        return []

    pattern = r"^@@ -(\d+),(\d+) \+(\d+),(\d+) @@.*$"
    result = []
    last = -1
    matches = list(re.finditer(pattern, patch, re.MULTILINE))

    for match in matches:
        if last == -1:
            last = match.start()
        else:
            result.append(patch[last : match.start()])
            last = match.start()
    if last != -1:
        result.append(patch[last:])

    return result


def patch_start_end_line(patch):
    pattern = r"^@@ -(\d+),(\d+) \+(\d+),(\d+) @@"
    match = re.search(pattern, patch, re.MULTILINE)
    if match:
        old_begin, old_diff, new_begin, new_diff = map(int, match.groups())
        return {
            "oldHunk": {
                "startLine": old_begin,
                "endLine": old_begin + old_diff - 1,
            },
            "newHunk": {
                "startLine": new_begin,
                "endLine": new_begin + new_diff - 1,
            },
        }
    else:
        return None


def parse_patch(patch):
    hunk_info = patch_start_end_line(patch)
    if hunk_info is None:
        return None

    old_hunk_lines = []
    new_hunk_lines = []

    new_line = hunk_info["newHunk"]["startLine"]

    lines = patch.split("\n")[1:]  # Skip the @@ line

    # Remove the last line if it's empty
    if lines[-1] == "":
        lines.pop()

    # Skip annotations for the first 3 and last 3 lines
    skip_start = 3
    skip_end = 3

    current_line = 0

    removal_only = not any(line.startswith("+") for line in lines)

    for line in lines:
        current_line += 1
        if line.startswith("-"):
            old_hunk_lines.append(line[1:])
        elif line.startswith("+"):
            new_hunk_lines.append(f"{new_line}: {line[1:]}")
            new_line += 1
        else:
            # context line
            old_hunk_lines.append(line)
            if removal_only or (current_line > skip_start and current_line <= len(lines) - skip_end):
                new_hunk_lines.append(f"{new_line}: {line}")
            else:
                new_hunk_lines.append(line)
            new_line += 1

    return {
        "oldHunk": "\n".join(old_hunk_lines),
        "newHunk": "\n".join(new_hunk_lines),
    }


filtered_files = []
for file in filter_selected_files:
    file_content = ""
    try:
        contents = repo.get_contents(file.filename, pr.base.sha)

        # Check if contents is a file and has content
        if contents.type == "file" and contents.content:
            file_content = base64.b64decode(contents.content).decode()
        else:
            print("The requested content is not a file or is empty.")
    except Exception as e:
        print(f"Failed to get file contents: {e}. This is OK if it's a new file.")

    file_diff = ""
    if file.patch:
        file_diff = file.patch

    patches = []
    for patch in split_patch(file.patch):
        patch_lines = patch_start_end_line(patch)
        if not patch_lines:
            continue
        hunks = parse_patch(patch)
        if not hunks:
            continue
        hunks_str = f"""
---new_hunk---
```
{hunks['newHunk']}
```

---old_hunk---
```
{hunks['oldHunk']}
```
"""
        patches.append([patch_lines["newHunk"]["startLine"], patch_lines["newHunk"]["endLine"], hunks_str])

    if patches:
        filtered_files.append((file.filename, file_content, file.patch, patches))

print(f"filtered_files: {filtered_files}")

# Filter out any None results
files_and_changes = [file for file in filtered_files if file is not None]

if not files_and_changes:
    print("Skipped: no files to review")

status_msg = "<details>\n<summary>Commits</summary>\nFiles that changed from the base of the PR and between {} and {} \
    commits.\n</details>\n".format(
    highest_reviewed_commit_id, pr.head.sha
)
if not files_and_changes:
    status_msg += ""
else:
    status_msg += "<details>\n<summary>Files selected ({})</summary>\n\n* {}\n</details>\n".format(
        len(files_and_changes),
        "\n* ".join([f"{filename} ({len(patches)})" for filename, _, _, patches in files_and_changes]),
    )
if not filter_ignored_files:
    status_msg += ""
else:
    status_msg += "<details>\n<summary>Files ignored due to filter ({})</summary>\n\n* {}\n\n</details>\n".format(
        len(filter_ignored_files), "\n* ".join([file["filename"] for file in filter_ignored_files])
    )

print(f"status_msg: {status_msg}")

summaries_failed = []


def do_summary(filename, file_content, file_diff):
    print(f"summarize: {filename}")
    ins = inputs.clone()  # Assuming 'inputs' is an instance of a class with a 'clone' method
    if len(file_diff) == 0:
        print(f"summarize: file_diff is empty, skip {filename}")
        summaries_failed.append(f"{filename} (empty diff)")
        return None

    ins.filename = filename
    ins.file_diff = file_diff

    # Render prompt based on inputs so far
    summarize_prompt = prompts.render_summarize_file_diff(ins, options.review_simple_changes)

    try:
        # Adapted to handle tuple returned by light_bot.chat
        summarize_resp, new_ids = light_bot.chat(
            summarize_prompt, {}
        )  # Assuming light_bot is an instance of the Bot class

        if summarize_resp == "":
            print("summarize: nothing obtained from openai")
            summaries_failed.append(f"{filename} (nothing obtained from openai)")
            return None
        else:
            if not options.review_simple_changes:
                # Parse the comment to look for triage classification
                triage_match = re.search(r"\[TRIAGE\]:\s*(NEEDS_REVIEW|APPROVED)", summarize_resp)
                if triage_match:
                    triage = triage_match.group(1)
                    needs_review = triage == "NEEDS_REVIEW"
                    # Remove the triage classification from the summary
                    summary = re.sub(r"\[TRIAGE\]:\s*(NEEDS_REVIEW|APPROVED)", "", summarize_resp).strip()
                    print(f"filename: {filename}, triage: {triage}")
                    return (filename, summary, needs_review)
            return (filename, summarize_resp, True)
    except Exception as e:
        print(f"summarize: error from openai: {e}")
        summaries_failed.append(f"{filename} (error from openai: {str(e)})")
        return None
