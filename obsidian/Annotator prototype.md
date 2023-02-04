## Before Feb 4

- Added the ability to send messages to server but putting that on hold
- Added a sidebar that will display the currently highlighted text
	- Only content script has access to document: send a message with updated selection
	- Background script listens for message and keeps track of the last selection
		- Without this, the content script would throw an error that nothing is listening for its messages
	- Sidebar also listens for message and updates textarea with selection
		- When freshly opened, send message to get the most latest selection from bg

## Feb 4

- Update the sidebar when the tab changes

## Future

- Save highlighted text for specific URLs
- Convert selection to Markup (bold, italic, links)