# This script creates and updates Markdown versions of Notebook files
# for publication on Kubeflow.org using Hugo/Docsy.
#
# Hugo Markdown files have a metadata section at the top of the page for the
# Front Matter. The Front Matter specifies the page Title, Description, and
# Weight. These values are used to generate the left side navigation, index
# pages, and some page content. 
#
# This script expects the Front Matter to be specified in the following format
# in the first cell of a Jupyter notebook:
#
# # {Title}
# > {Description}
#
# So, the Title is expected to be a Heading 1 and the Description is expected to
# immediately follow it as a Blockquote. Currently, there is no Weight in the
# notebook file.
#
# The script reads the Front Matter from the existing Markdown file,
# or initializes default values, and then overrides the Markdown file's
# Front Matter with values from the notebook. 
#
# * The Weight is always used from the Markdown file. If no Markdown file
#   exists, this will default to `DEFAULT_WEIGHT`. Which should push doc to
#   the end of the list. Edit the Markdown file to specify the correct Weight.
# * If no Title is specified in the notebook, the Markdown file's
#   front matter is used.
# * If the Title is specified in the notebook and the Description is not,
#   the notebook's Title is used and otherwise the Markdown file's front
#   matter is used.
#
# To run this script, type the following on the command line:
#   python3 scripts/nb_to_md.py --notebook /content/en/docs/path-to-notebook
#
# Input:
#   The path to the notebook to convert to Markdown as `--notebook` command
#   line flag.
#
# Output:
#   STDOUT returns the status of the conversion process.
#
# Dependencies:
#   This script depends on `absl`, `nbconvert`, `nbformat`, and `toml`. You
#   may need to install these dependencies using a command like the following:
#   pip3 install nbconvert

from pathlib import Path
import re
from typing import Tuple 

from absl import app
from absl import flags
from nbconvert.exporters import MarkdownExporter
import nbformat
import toml

FLAGS = flags.FLAGS

flags.DEFINE_string(
    'notebook',
    None,
    'Path to the notebook to publish. Should start with "content/en/docs"')

DEFAULT_WEIGHT = 900

class MarkdownFile:
  """Represents the Markdown version of a notebook."""
  
  
  def __init__(self, file_path):
      self.file_path = file_path
      
  def exists(self):
    """Indicates if the Markdown file exists."""
    return Path(self.file_path).exists()
  
  def parse_front_matter(self) -> Tuple[str, str, int]:
    """Parses Front Matter values from Markdown
    
      Returns
        A tuple containing the title, description, and weight.
    """
    
    # default values
    title = None
    description = None
    weight = DEFAULT_WEIGHT
    
    if self.exists():
      content = Path(self.file_path).read_text()

      # find the front matter section
      regexp = re.compile('\++\n(.*?)\++\n', re.S)
      m = regexp.match(content)
      front_matter_content =  m.group(1)

      # load the TOML
      front_matter = toml.loads(front_matter_content)

      if 'title' in front_matter:
        title = front_matter['title']

      if 'description' in front_matter:
        description = front_matter['description']

      if 'weight' in front_matter:
        weight = front_matter['weight']
    
    return title, description, weight

  def write_file(self, content: str):
    p = Path(self.file_path)
    p.write_text(content)
  
class NotebookFile:
  """Represents a Jupyter notebook file."""
  
  def __init__(self, file_path):
    self.file_path = file_path
    
  def exists(self):
    """Indicates if the notebook file exists."""
    return Path(self.file_path).exists()
  
  def get_markdown_file(self):
    p = Path(self.file_path)
    markdown_file_path = p.with_suffix('.md')
    
    return MarkdownFile(markdown_file_path)
  
  def parse_front_matter(self, content, markdown) -> Tuple[str, str, int, str]:
    """Gets the Front Matter for the updated notebook.
    Uses the Markdown Front Matter as the default values and overrides with 
    content from the notebook.
    
    Args:
      content: The notebook content converted to Markdown.
      markdown: An instance of MarkdownFile.
    
    Returns:
       A tuple containing the title, description, weight, and content without
       the Front Matter."""
    title, description, weight = markdown.parse_front_matter()
    
    content_idx = 0
  
    # find the title
    idx = content.find('\n')
    if idx:
      line = content[0:idx]
      if line.startswith("#"):
        title = line[1:].strip()
        content_idx = idx + 1

      # find the description
      descIdx = content.find('\n', idx + 1)
      if descIdx:
        line = content[idx + 1:descIdx]
        if line.startswith(">"):
          description = line[1:].strip()
          content_idx = descIdx + 1
    
    content = content[content_idx:]
    
    return title, description, weight, content
    
  def publish_markdown(self):
    """Updates the Markdown version of a Jupyter notebook file."""
    
    nb = self.get_clean_notebook();
    exporter = MarkdownExporter()
    (content, resources) = exporter.from_notebook_node(nb)
    
    markdown = self.get_markdown_file()
    
    # separate front matter from content
    title, description, weight, content = self.parse_front_matter(
        content, markdown)
    
    template = ('+++\n'
               'title = "{0}"\n'
               'description = "{1}"\n'
               'weight = {2}\n'
               '+++\n\n'
               '<!--\n' 
               'AUTOGENERATED FROM {4}\n'
               'PLEASE UPDATE THE JUPYTER NOTEBOOK AND REGENERATE THIS FILE'
               ' USING scripts/nb_to_md.py.'
               '-->\n\n'
               '<style>\n'
               '.notebook-links {{display: flex; margin: 1em 0;}}\n'
               '.notebook-links a {{padding: .75em; margin-right: .75em;'
               ' font-weight: bold;}}\n'
               'a.colab-link {{\n'
               'padding-left: 3.25em;\n'
               'background-image: url(/docs/images/logos/colab.ico);\n'
               'background-repeat: no-repeat;\n'
               'background-size: contain;\n'
               '}}\n'
               'a.github-link {{\n'
               'padding-left: 2.75em;\n'
               'background-image: url(/docs/images/logos/github.png);\n'
               'background-repeat: no-repeat;\n'
               'background-size: auto 75%;\n'
               'background-position: left center;\n'
               '}}\n'
               '</style>\n'
               '<div class="notebook-links">\n'
               '<a class="colab-link" href="https://colab.research.google.com/'
               'github/kubeflow/website/blob/master/{4}">Run in Google Colab'
               '</a>\n'
               '<a class="github-link" href="https://github.com/kubeflow/websi'
               'te/blob/master/{4}">View source on GitHub</a>\n'
               '</div>\n\n'
               '{3}'
               '\n\n'
               '<div class="notebook-links">\n'
               '<a class="colab-link" href="https://colab.research.google.com/'
               'github/kubeflow/website/blob/master/{4}">Run in Google Colab'
               '</a>\n'
               '<a class="github-link" href="https://github.com/kubeflow/websi'
               'te/blob/master/{4}">View source on GitHub</a>\n'
               '</div>')
    
    markdown.write_file(
        template.format(title, description, weight, content, self.file_path))

  def format_as_terminal(self, commands: str) -> str:
    """Formats a command block to indicate that it contains terminal commands.
    
    Args:
      commands: The command block to format.
    
    Returns:
      The reformatted command block.
    """
    
    lines = commands.split('\n')
    buffer = []
    for line in lines:
      if line.startswith('!'):
        line = '$ {}'.format(line[1:])
      buffer.append(line)
    return '\n'.join(buffer)
  
  def get_clean_notebook(self):
    """Cleans up formatting when converting notebook content to Markdown."""
    
    nb = nbformat.read(self.file_path, as_version=4)
    for cell in nb.cells:
      if cell.cell_type == 'code' and cell.source.find('!') != -1:
        cell.source = self.format_as_terminal(cell.source)
    return nb
  

def main(argv):
  """[nb_to_md.py] Publish Jupyter notebooks as a Kubeflow.org Markdown page"""
  
  if FLAGS.notebook is not None:
    notebook = NotebookFile(FLAGS.notebook)
    if notebook.exists():
      notebook.publish_markdown()
      print('Markdown content has been updated!')
    else:
      print(('Could not update Markdown content.'
             ' Notebook file was not found at "{}"').format(FLAGS.notebook))
  else:
    print(('Could not update Markdown content.'
           ' No notebook parameter was specified.'))

if __name__ == '__main__':
  app.run(main)