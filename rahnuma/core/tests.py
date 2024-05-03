# tests.py
from unittest.mock import MagicMock, Mock, patch

from django.test import RequestFactory, TestCase
from django.urls import reverse

from rahnuma.core.services.code_review import code_review
from rahnuma.core.views import pull_request, summarize


class PullRequestViewTest(TestCase):
    def setUp(self):
        self.factory = RequestFactory()

    @patch("rahnuma.core.views.get_repo_and_pr")
    def test_pull_request_view(self, mock_get_repo_and_pr):
        mock_repo = MagicMock()
        mock_pr = MagicMock()
        mock_get_repo_and_pr.return_value = (mock_repo, mock_pr)

        request = self.factory.post(reverse("core:pull_request"), {"repo_name": "test_repo", "pr_number": 1})
        response = pull_request(request)

        self.assertEqual(response.status_code, 200)
        mock_get_repo_and_pr.assert_called_once_with("test_repo", 1)


class SummarizeViewTest(TestCase):
    def setUp(self):
        self.factory = RequestFactory()

    @patch("rahnuma.core.views.get_repo_and_pr")
    @patch("rahnuma.core.views.code_review")
    def test_summarize_view(self, mock_code_review, mock_get_repo_and_pr):
        mock_repo = MagicMock()
        mock_pr = MagicMock()
        mock_get_repo_and_pr.return_value = (mock_repo, mock_pr)
        mock_code_review.return_value = "Test summary"

        request = self.factory.post(reverse("core:summarize"), {"repo_name": "test_repo", "pr_number": 1})
        response = summarize(request)

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.content.decode(), "Test summary")
        mock_get_repo_and_pr.assert_called_once_with("test_repo", 1)
        mock_code_review.assert_called_once_with(mock_repo, mock_pr)


class CodeReviewTests(TestCase):
    @patch("rahnuma.core.services.code_review.Bot")  # Mock the Bot class in the code_review function
    @patch("rahnuma.core.services.options.Options")
    @patch("rahnuma.core.services.prompts.Prompts")
    @patch("rahnuma.core.services.inputs.Inputs")
    @patch("rahnuma.core.services.options.OpenAIOptions")
    def test_code_review(self, mock_open_ai_options, mock_inputs, mock_prompts, mock_options, mock_bot):
        # Arrange
        mock_bot_instance = Mock()
        mock_bot_instance.chat = Mock(return_value="Mocked chat response")
        mock_bot.return_value = mock_bot_instance

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
