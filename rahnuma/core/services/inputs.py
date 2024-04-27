class Inputs:
    def __init__(
        self,
        system_message="",
        title="no title provided",
        description="no description provided",
        raw_summary="",
        short_summary="",
        filename="",
        file_content="file contents cannot be provided",
        file_diff="file diff cannot be provided",
        patches="",
        diff="no diff",
        comment_chain="no other comments on this patch",
        comment="no comment provided",
    ):
        self.system_message = system_message
        self.title = title
        self.description = description
        self.raw_summary = raw_summary
        self.short_summary = short_summary
        self.filename = filename
        self.file_content = file_content
        self.file_diff = file_diff
        self.patches = patches
        self.diff = diff
        self.comment_chain = comment_chain
        self.comment = comment

    def clone(self):
        return Inputs(
            self.system_message,
            self.title,
            self.description,
            self.raw_summary,
            self.short_summary,
            self.filename,
            self.file_content,
            self.file_diff,
            self.patches,
            self.diff,
            self.comment_chain,
            self.comment,
        )

    def render(self, content):
        if not content:
            return ""
        replacements = {
            "$system_message": self.system_message,
            "$title": self.title,
            "$description": self.description,
            "$raw_summary": self.raw_summary,
            "$short_summary": self.short_summary,
            "$filename": self.filename,
            "$file_content": self.file_content,
            "$file_diff": self.file_diff,
            "$patches": self.patches,
            "$diff": self.diff,
            "$comment_chain": self.comment_chain,
            "$comment": self.comment,
        }
        for key, value in replacements.items():
            content = content.replace(key, value)
        return content
