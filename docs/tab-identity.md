# Tab Identity

This document provides an overview of the different tab types and their unique identification properties, as well as the importance of preserving tab identity across changes to avoid losing important meta data and editor instances attached to them. It also discusses the potential consequences of identity loss and how to recover from it if it occurs.

## Overview

There are 8 different kind of tab types:
- TabInputText
- TabInputTextDiff
- TabInputCustom
- TabInputNotebook
- TabInputNotebookDiff
- TabInputWebview
- TabInputTerminal
- Unknown

Each type has different behaviours when it comes to unique identification. Some of them are unique per tab group while some others are completely unique thus possibly having duplicate identifiers.

Here is a breakdown of the different tab types and their unique identification properties:

- TabInputText
  - Unique per tab group
  - Main identifier: resource URI
  - Secondary identifier: viewColumn (to distinguish between duplicates in different tab groups)
- TabInputTextDiff
  - Unique per tab group
  - Main identifier: original and modified resource URIs
  - Secondary identifier: viewColumn (to distinguish between duplicates in different tab groups)
- TabInputCustom
  - Not unique
  - Main identifier: viewType + uri
  - Secondary identifier: viewColumn (to distinguish between duplicates in different tab groups)
- TabInputNotebook
  - Unique per tab group
  - Main identifier: resource URI
  - Secondary identifier: viewColumn (to distinguish between duplicates in different tab groups)
- TabInputNotebookDiff
  - Unique per tab group
  - Main identifier: original and modified resource URIs
  - Secondary identifier: viewColumn (to distinguish between duplicates in different tab groups)
- TabInputWebview
  - Not unique
  - Main identifier: viewType
  - Secondary identifier: viewColumn (to distinguish between duplicates in different tab groups)
- TabInputTerminal
  - Not unique
  - Main identifier: label
  - Secondary identifier: viewColumn (to distinguish between duplicates in different tab groups)
- Unknown
  - Not unique
  - Main identifier: label
  - Secondary identifier: viewColumn (to distinguish between duplicates in different tab groups)

## Meta Data

Following kind of tabs have meta data or editor instances attached to them:
- TabInputText
- TabInputTextDiff
- TabInputNotebook
- TabInputNotebookDiff
- TabInputTerminal

Thus it is of upmost importance to preserve the identity of these tabs across changes, otherwise we risk losing important meta data and editor instances attached to them. This is done by using the main identifier properties mentioned above as clues to match tabs across changes, while also taking into account the secondary identifier to distinguish between duplicates in different tab groups.

It is possible to recover from identity loss but in order to do this we need to get their associated editor or terminal instance active and even then it might be finicky since the terminal instance has no clue besides the title how it is related to the tab. Editors should be somewhat possible as their contain the resource URI in their document, but even then it might be tricky to get the correct editor if there are multiple editors with the same resource URI open in different tab groups. Thus it is best to avoid identity loss in the first place by using the main identifier properties as clues to match tabs across changes, while also taking into account the secondary identifier to distinguish between duplicates in different tab groups.

### Editor related Meta Data

The meta data attached to editor tabs contains important information such as the selection range of the editor, which is crucial for providing a seamless user experience when switching between tabs. Losing the identity of these tabs would result in losing this important meta data attached to them, which could lead to a frustrating user experience as they would lose their place in the file they were editing.

Follwing kind of tabs have editor related meta data attached to them:
- TabInputText
- TabInputTextDiff
- TabInputNotebook
- TabInputNotebookDiff

### Terminal Instances

The meta data attached to terminal tabs contains important information such as cwd, isTransient, shellPath and terminalName, which are crucial for providing a seamless user experience when switching between terminal tabs. Losing the identity of these tabs would result in losing this important meta data attached to them, which could lead to a frustrating user experience as they would lose their terminal configuration and state.

**Important**: Without the meta data a terminal is not recoverable. ShellPath and CWD are crucial for the terminal to be able to launch the correct shell and be in the correct directory.

Following kind of tabs have terminal related meta data attached to them:
- TabInputTerminal