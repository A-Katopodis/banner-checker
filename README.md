# Banner Checker
Banner checker is a simple action that validates that the files in a repository are having a specific banner for compliance reasons. The supported files are .js, .yml files for now.
# Supported file types
- .js
- .yml

We will keep expanding that list.

# Getting started
There are only 2 required parameters for the action:

- `banner`: The banner you want to specify for the files to be checked to.
- `path`: The path to the folder that contains the repository you want to scan for. 

```yml
  with:
    # relative path
    path: "your_repository"
    # your banner. Use only \n to specify new lines.
    banner: "testbanner should be\nnewline" 
```