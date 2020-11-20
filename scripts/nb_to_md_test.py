from pathlib import Path
import unittest
from unittest.mock import Mock
from unittest.mock import patch

import nb_to_md


class MarkdownFileTest(unittest.TestCase):
    
    def test_parse_front_matter_default_values(self):
        with patch.object(nb_to_md.MarkdownFile, 'exists', return_value=False):
            markdown = nb_to_md.MarkdownFile('content/en/docs/foo.md')
            title, description, weight = markdown.parse_front_matter()
            self.assertEqual(weight, nb_to_md.DEFAULT_WEIGHT)
            self.assertIsNone(title)
            self.assertIsNone(description)
    
    def test_parse_front_matter_success(self):
        fake_title = "Building an example title"
        fake_description = "Learn more about building fake content"
        fake_weight = 42
        
        fake_content = """+++
title = "{}"
description = "{}"
weight = {}
+++

Lorem ipsum something or other.""".format(
            fake_title,
            fake_description,
            fake_weight)
        
        with patch.object(nb_to_md.MarkdownFile, 'exists', return_value=True):
            with patch.object(Path, 'read_text', return_value=fake_content):
                markdown = nb_to_md.MarkdownFile('content/en/docs/foo.md')
                title, description, weight = markdown.parse_front_matter()
                self.assertEqual(weight, fake_weight)
                self.assertEqual(title, fake_title)
                self.assertEqual(description, fake_description)
    
        
class NotebookFileTests(unittest.TestCase):

    def test_format_as_terminal_success(self):
        fake_command = """!pip install
        kfp
!pip install tfx"""
        
        notebook = nb_to_md.NotebookFile('content/en/docs/foo.ipynb')
        actual = notebook.format_as_terminal(fake_command)
        self.assertEqual(actual, fake_command.replace('!', '$ '))
    
    def test_format_as_terminal_no_changes(self):
        fake_command = """def foo(bar: str) -> str:
  if !bar.startswith('something'):
    # do something
  return bar"""
        
        notebook = nb_to_md.NotebookFile('content/en/docs/foo.ipynb')
        actual = notebook.format_as_terminal(fake_command)
        self.assertEqual(actual, fake_command)
    
    def test_parse_front_matter_success(self):
        fake_title = "Build test cases for doc tools"
        fake_description = "Learning how to build test cases"
        fake_page_content = '\nLorem ipsum dolor sit amet, something or other.'
        fake_content = """# {}
> {}
{}""".format(fake_title, fake_description, fake_page_content)
        with patch.object(nb_to_md.MarkdownFile,
                          'parse_front_matter',
                          return_value=(None, None, nb_to_md.DEFAULT_WEIGHT)):
            markdown = nb_to_md.MarkdownFile('content/en/docs/foo.md')
            notebook = nb_to_md.NotebookFile('content/en/docs/foo.ipynb')
            title, description, weight, content = notebook.parse_front_matter(
                fake_content, markdown)
            self.assertEqual(weight, nb_to_md.DEFAULT_WEIGHT)
            self.assertEqual(title, fake_title)
            self.assertEqual(description, fake_description)
            self.assertEqual(content, fake_page_content)
    
    def test_parse_front_matter_no_description(self):
        fake_title = "Build test cases for doc tools"
        fake_page_content = '\nLorem ipsum dolor sit amet, something or other.'
        fake_content = """# {}
{}""".format(fake_title,  fake_page_content)
        with patch.object(nb_to_md.MarkdownFile,
                          'parse_front_matter',
                          return_value=(None, None, nb_to_md.DEFAULT_WEIGHT)):
            markdown = nb_to_md.MarkdownFile('content/en/docs/foo.md')
            notebook = nb_to_md.NotebookFile('content/en/docs/foo.ipynb')
            title, description, weight, content = notebook.parse_front_matter(
                fake_content, markdown)
            self.assertEqual(weight, nb_to_md.DEFAULT_WEIGHT)
            self.assertEqual(title, fake_title)
            self.assertIsNone(description)
            self.assertEqual(content, fake_page_content)

    def test_parse_front_matter_no_front_matter(self):
        fake_page_content = 'Lorem ipsum dolor sit amet, something or other.'
        with patch.object(nb_to_md.MarkdownFile,
                          'parse_front_matter',
                          return_value=(None, None, nb_to_md.DEFAULT_WEIGHT)):
            markdown = nb_to_md.MarkdownFile('content/en/docs/foo.md')
            notebook = nb_to_md.NotebookFile('content/en/docs/foo.ipynb')
            title, description, weight, content = notebook.parse_front_matter(
                fake_page_content, markdown)
            self.assertEqual(weight, nb_to_md.DEFAULT_WEIGHT)
            self.assertIsNone(title)
            self.assertIsNone(description)
            self.assertEqual(content, fake_page_content)

    
if __name__ == "__main__":
    unittest.main()