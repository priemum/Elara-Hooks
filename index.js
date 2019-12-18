const {post} = require('superagent');
const Colors = {
    DEFAULT: 0x000000,
    WHITE: 0xFFFFFF,
    AQUA: 0x1ABC9C,
    GREEN: 0x2ECC71,
    BLUE: 0x3498DB,
    YELLOW: 0xFFFF00,
    PURPLE: 0x9B59B6,
    LUMINOUS_VIVID_PINK: 0xE91E63,
    GOLD: 0xF1C40F,
    ORANGE: 0xE67E22,
    RED: 0xE74C3C,
    GREY: 0x95A5A6,
    NAVY: 0x34495E,
    DARK_AQUA: 0x11806A,
    DARK_GREEN: 0x1F8B4C,
    DARK_BLUE: 0x206694,
    DARK_PURPLE: 0x71368A,
    DARK_VIVID_PINK: 0xAD1457,
    DARK_GOLD: 0xC27C0E,
    DARK_ORANGE: 0xA84300,
    DARK_RED: 0x992D22,
    DARK_GREY: 0x979C9F,
    DARKER_GREY: 0x7F8C8D,
    LIGHT_GREY: 0xBCC0C0,
    DARK_NAVY: 0x2C3E50,
    BLURPLE: 0x7289DA,
    GREYPLE: 0x99AAB5,
    DARK_BUT_NOT_BLACK: 0x2C2F33,
    NOT_QUITE_BLACK: 0x23272A,
  },
  resolveColor = (color) => {
    if (typeof color === 'string') {
      if (color === 'RANDOM') return Math.floor(Math.random() * (0xFFFFFF + 1));
      if (color === 'DEFAULT') return 0;
      color = Colors[color] || parseInt(color.replace('#', ''), 16);
    } else if (Array.isArray(color)) {
      color = (color[0] << 16) + (color[1] << 8) + color[2];
    }
    if (color < 0 || color > 0xFFFFFF) color = 0;
    else if (color && isNaN(color)) color = 0;

    return color;
  }
module.exports = class Webhook{
  constructor(url){
    if(!url) throw new Error(`[Webhook Service] | You didn't provide a webhook URL`);
    if(typeof url !== "string") throw new Error(`[Webhook Service] | The 'url' has to be a string!`);
    if(!url.toString().includes(`discordapp.com/api/webhooks/`)) throw new Error(`[Webhook Service] | The 'url' you provided isn't valid!`);
    this.webhook = url;
    this.embed = {
      title: null,
      color: null,
      description: null,
      timestamp: null,
      thumbnail: {
        url: null
      },
      image: {
        url: null
      },
      author: {
        name: null,
        icon_url: null,
        url: null
      },
      footer: {
        text: null,
        icon_url: null
      },
      fields: []
    };
    this.request = {
      "content": "",
      "embeds": [this.embed],
      "avatar_url": "",
      "username": ""
    }
  };
  setMention(id){
    if(id){
      if(id.toString().startsWith("<@") && id.toString().endsWith(">")){
      this.request.content = `${id}${this.request.content ? `, ${this.request.content}` : ""}`;
      }
    };
    return this;
  };
  setTitle(title){
    if(title){
      if(title.toString().length > 256) throw new Error(`[Webhook Service] | "title" can't be over 256 characters!`);
      this.embed.title = title;
    }
    return this;
  };
  setDescription(description){
    if(description){
      if(description.toString().length > 2048) throw new Error(`[Webhook Service] | "description" can't be over 2,048 characters!`);
      this.embed.description = description;
    }
    return this;
  };
  addField(name = "", value = "", inline = false){
    if(this.embed.fields.length > 25) throw new Error(`[Webhook Service] | "fields" can't go over 25 fields!`);
    if(name === "" && value === "") throw new Error(`[Webhook Service] | "fields" name & value is blank, fill them out!`);
    if(name.toString().length > 256) throw new Error(`[Webhook Service] | "fields" name can't be over 256 characters!`);
    if(value.toString().length > 1024) throw new Error(`[Webhook Service] | "fields" value can't be over 1,024 characters!`);
    this.embed.fields.push({name: name, value: value, inline: inline});
    return this;
  };
  addBlankField(inline = false){
    if(this.embed.fields.length > 25) throw new Error(`[Webhook Service] | "fields" can't go over 25 fields!`);
    this.embed.fields.push({name: "\u200b", value: "\u200b", inline: inline});
    return this;
  };
  setContent(content){
    if(content){
      if(content.toString().length >= 2000) throw new Error(`[Webhook Service] | The 'content' your provided is over 2,000 characters!`);
      this.request.content = this.request.content += content;
    }
    return this;
  };
  setTimestamp(date){
    if(date){
      let d = new Date(date);
      if(!d) d = new Date();
      this.embed.timestamp = d;
    }else{
      this.embed.timestamp = new Date();
    }
    return this;
  };
  setAuthor(name, icon, url){
    if(name){
      this.embed.author.name = name;
    };
    if(icon){
      this.embed.author.icon_url = icon;
    };
    if(url){
      this.embed.author.url = url;
    };
    return this;
  };
  setFooter(name, icon){
    if(name){
      this.embed.footer.text = name;
    };
    if(icon){
      this.embed.footer.icon_url = icon;
    };
    return this;
  };
  setUsername(name){
    if(name){
      if(name.toString().length > 32) throw new Error(`[Webhook Service] | Webhook 'username' can't be over 32 characters!`);
      this.request.username = name;
    };
    return this;
  };
  setAvatar(url){
    if(url){
      this.request.avatar_url = url;
    }
    return this;
  };
  setImage(url){
    if(url){
      this.embed.image.url = url;
    };
    return this;
  };
  setThumbnail(url){
    if(url){
      this.embed.thumbnail.url = url;
    }
    return this;
  };
  setColor(color){
      if(color){
        this.embed.color = resolveColor(color);
      }
      return this;
  };
  setColour(colour){
    if(colour){
        this.embed.color = resolveColor(colour);
    }
    return this;
  };
  send(){
    const check = (req) => {
      let embed = req.embeds[0];
      let i = [];
      if(req.content !== "") i.push(true);
      if(embed.hasOwnProperty("title")) i.push(true);
      if(embed.hasOwnProperty("description")) i.push(true);
      if(embed.hasOwnProperty("thumbnail")){
        if(embed.thumbnail.url) i.push(true)
      }
      if(embed.hasOwnProperty("image")){
        if(embed.image.url) i.push(true)
      }
      if(embed.hasOwnProperty("author")){
        if(embed.author.name) i.push(true);
        if(embed.author.icon_url) i.push(true);
        if(embed.author.url) i.push(true);
      }
      if(embed.hasOwnProperty("footer")){
        if(embed.footer.text) i.push(true);
        if(embed.footer.icon_url) i.push(true);
      }
      if(embed.hasOwnProperty("fields")){
        if(!Array.isArray(embed.fields)) throw new Error(`[Webhook Service] | "embed.fields" has to be an array!`);
        if(embed.fields.length !== 0) i.push(true)
      }
      if(i.length === 0) return false;
      return true;
    }, getEmbed = (req) => {
      let embed = req.embeds[0], i = [];
      if(embed.hasOwnProperty("title")){
        if(embed.title) i.push("Title");
      }
      if(embed.hasOwnProperty("description")){
        if(embed.description) i.push("Description");
      }
      if(embed.hasOwnProperty("thumbnail")){
        if(embed.thumbnail.url) i.push("Thumbnail")
      }
      if(embed.hasOwnProperty("image")){
        if(embed.image.url) i.push("Image")
      }
      if(embed.hasOwnProperty("author")){
        if(embed.author.name) i.push("author.name");
        if(embed.author.icon_url) i.push("author.icon_url");
        if(embed.author.url) i.push('author.url');
      }
      if(embed.hasOwnProperty("footer")){
        if(embed.footer.text) i.push("footer.text");
        if(embed.footer.icon_url) i.push("footer.icon_url");
      }
      if(embed.hasOwnProperty("fields")){
        if(!Array.isArray(embed.fields)) throw new Error(`[Webhook Service] | "embed.fields" has to be an array!`);
        if(embed.fields.length !== 0) i.push("fields")
      }
      if(i.length === 0) return [];
      return [embed];
    };
    if(check(this.request) === false) throw new Error(`[Webhook Service] | You didn't provide anything to send!`);
    let embed = getEmbed(this.request);
    post(this.webhook)
    .send({
      "content": this.request.content,
      "embeds": embed,
      "avatar_url": this.request.avatar_url,
      "username": this.request.username
    }).then(() => {
      this.request.content = "";
      this.embed = {
        title: null,
        color: null,
        description: null,
        timestamp: null,
        thumbnail: {
          url: null
        },
        image: {
          url: null
        },
        author: {
          name: null,
          icon_url: null,
          url: null
        },
        footer: {
          text: null,
          icon_url: null
        },
        fields: []
      };
      this.request.embeds = [{
        title: null,
        color: null,
        description: null,
        timestamp: null,
        thumbnail: {
          url: null
        },
        image: {
          url: null
        },
        author: {
          name: null,
          icon_url: null,
          url: null
        },
        footer: {
          text: null,
          icon_url: null
        },
        fields: []
      }];
      this.request.username = "";
      this.request.avatar_url = "";
    }).catch(err => {
      this.request.content = "";
      this.embed = {
        title: null,
        color: null,
        description: null,
        timestamp: null,
        thumbnail: {
          url: null
        },
        image: {
          url: null
        },
        author: {
          name: null,
          icon_url: null,
          url: null
        },
        footer: {
          text: null,
          icon_url: null
        },
        fields: []
      };
      this.request.embeds = [{
        title: null,
        color: null,
        description: null,
        timestamp: null,
        thumbnail: {
          url: null
        },
        image: {
          url: null
        },
        author: {
          name: null,
          icon_url: null,
          url: null
        },
        footer: {
          text: null,
          icon_url: null
        },
        fields: []
      }];
      this.request.username = "";
      this.request.avatar_url = "";
      throw new Error(`[Webhook Service] | Error while trying to send the webhook: ${err.stack}`)
    })
  };
}
