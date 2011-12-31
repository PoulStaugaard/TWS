# Introduction

This is a very basic TiddlyWiki server written for Node.js

It serves as an alternative to using TiddlyWiki's built-in methods for saving your content.

# Usage

	node tws
	
start a server and launch Google Chrome on the current folder, or

	node tws folder
	
to browse a specified folder.

# Issues

*	The backstage actions that integrate with web resources (upgrade, import) are not implemented.
*	The path used for launching Chrome on Windows is specific to the english version; on, say, danish Windows, "Local Settings" would be "Lokale Indstillinger". Thank you Microsoft.

