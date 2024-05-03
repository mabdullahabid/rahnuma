from unittest.mock import Mock, patch

from django.test import TestCase

from .services.code_review import code_review


class CodeReviewTests(TestCase):
    @patch("rahnuma.core.services.bot.Bot")
    @patch("rahnuma.core.services.options.Options")
    @patch("rahnuma.core.services.prompts.Prompts")
    @patch("rahnuma.core.services.inputs.Inputs")
    @patch("rahnuma.core.services.options.OpenAIOptions")
    def test_code_review(self, MockOpenAIOptions, MockInputs, MockPrompts, MockOptions, MockBot):
        # Arrange
        mock_repo = Mock()
        mock_pr = Mock()
        mock_pr.title = "Test PR"
        mock_pr.body = "Test PR body"
        mock_pr.get_commits.return_value = [Mock(), Mock()]
        mock_pr.base.sha = "base_sha"
        mock_pr.head.sha = "head_sha"

        mock_file = Mock()
        mock_file.filename = "test_filename"
        mock_file.patch = "test_patch"
        mock_repo.compare.return_value.files = [mock_file, mock_file]
        mock_repo.compare.return_value.commits = [Mock(), Mock()]

        # Act
        result = code_review(mock_repo, mock_pr)

        # Assert
        self.assertIsNotNone(result)
