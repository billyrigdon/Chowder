Node Notify
================

##Install

`npm install node-notify`

##Usage

```
var notify = require('node-notify');

notify('Hello World');  // Pass only a string

notify({title: "My App", message: "Hello World"});  // Pass object with multiple paramters
```

##Parameters

`message: VALUE` **[Required]**

The message body of the notification.

---
`title: VALUE`

The title of the notification. **[Default: 'Terminal']**.

---
`subtitle: VALUE`

The subtitle of the notification.

---
`sound NAME`

The name of a sound to play when the notification appears. The names are listed in Sound Preferences. Use 'default' for the default notification sound.

---
`group ID`

Specifies the ‘group’ a notification belongs to. For any ‘group’ only one notification will ever be shown, replacing previously posted notifications.

A notification can be explicitely removed with the `remove` option, describe below.

Examples are:

- The sender’s name to scope the notifications by tool.
- The sender’s process ID to scope the notifications by a unique process.
- The current working directory to scope notifications by project.

---
`-remove ID`

Removes a notification that was previously sent with the specified ‘group’ ID, if one exists. If used with the special group "ALL", all message are removed.

---
`list ID`

Lists details about the specified ‘group’ ID. If used with the special group "ALL", details about all currently active messages are displayed.

The output of this command is tab-separated, which makes it easy to parse.

---
`activate ID`

Specifies which application should be activated when the user clicks the notification.

You can find the bundle identifier of an application in its `Info.plist` file inside the application bundle.

Examples are:

- com.apple.Terminal to activate Terminal.app
- com.apple.Safari to activate Safari.app

-OR-

Simply supply the app name and node-notify will attempt to find the app and its bundle identifier


---
`sender ID`

Specifying this will make it appear as if the notification was send by that application instead, including using its icon.

Using this option fakes the sender application, so that the notification system will launch that application when the notification is clicked. Because of this it is important to note that you cannot combine this with options like `execute` and `activate` which depend on the sender of the notification to be ‘terminal-notifier’ to perform its work.

For information on the `ID` see the `activate` option.

---
`open URL`

Specifies a resource to be opened when the user clicks the notification. This can be a web or file URL, or any custom URL scheme.

---
`execute COMMAND`

Specifies a shell command to run when the user clicks the notification.