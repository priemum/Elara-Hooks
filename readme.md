# Elara Webhooks Builder & Sender.

**NPM:** https://www.npmjs.com/package/elara-hook


```javascript
const Service = require("elara-hook");
const Webhook = new Service("WEBHOOK URL HERE");

Webhook
.setContent("Content") // Content of the message.
.setMention("<@userid> or <@&roleid>") // Mentions the user or role at the start of the message content.
.setAvatar("Image URL") // Sets the avatar icon for the webhook
.setUsername("Discord") // Sets the username for the webhook.
.setTitle("Title") // Title of the embed
.setDescription("Description") // Description of the embed
.setAuthor("Name", "Image", "LINK") // Author of the embed
.setColor("#ff0000") // or `.setColour("#ff0000")` Color of the embed
.setFooter("Name", "Image") // Footer of the embed
.setThumbnail("Image URL") // Thumbnail of the embed
.setImage("Image URL") // Image of the embed
.addField("Name", "Value", true) // Adds a field to the embed, max 25
.addBlankEmbed(true) // Adds a blank field to the embed, true, false to make it inline
.setTimestamp(optional_time) //  Adds the timestamp to the embed.
.send() // Sends the message/embed.
```
