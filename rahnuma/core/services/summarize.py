from .code_review import do_summary, files_and_changes, heavy_bot, inputs, prompts

summaries = []
for filename, file_content, file_diff, _ in files_and_changes:
    summaries.append(do_summary(filename, file_content, file_diff))
print(summaries)

# Assuming summaries is a list of tuples [(filename, summary), ...]
# and heavyBot is an instance of the Bot class, similar to previous examples

batch_size = 10
if summaries:
    for i in range(0, len(summaries), batch_size):
        summaries_batch = summaries[i : i + batch_size]
        for filename, summary, _ in summaries_batch:
            inputs.raw_summary += f"---\n{filename}: {summary}\n"

        # Assuming prompts has a method render_summarize_changesets that prepares the prompt
        summarize_prompt = prompts.render_summarize_changesets(inputs)

        # Call to heavyBot.chat needs to be adapted to Python's async handling if necessary
        # For a synchronous call or if wrapped inside an async method:
        summarize_resp, _ = heavy_bot.chat(summarize_prompt, {})

        if summarize_resp == "":
            print("summarize: nothing obtained from openai")  # Assuming print as a placeholder for warning
        else:
            inputs.raw_summary = summarize_resp

print(inputs.raw_summary)

summarize_final_response = heavy_bot.chat(prompts.render_summarize(inputs), {})

for r in summarize_final_response:
    print(r)
