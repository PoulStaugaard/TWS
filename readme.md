# Introduction

This is a very basic TiddlyWiki server written for Node.js

It serves as an alternative to using TiddlyWiki's built-in methods for saving your content.

# Usage

	node tws
	
start a server and launch Google Chrome on the current folder, or

	node tws path
	
to browse a specified folder or file.

# Issues

*	The backstage actions that integrate with web resources (upgrade, import) are not implemented.
*	The path used for launching Chrome on Windows XP is specific to the english version; on, say, danish Windows, "Local Settings" would be "Lokale Indstillinger". My solution for now is to allow you to tell TWS where the 'Google' folder is by setting the environment variable 'GooglePath' to, say 'C:\Documents and Settings\Poul\Lokale indstillinger\Application Data\'.

