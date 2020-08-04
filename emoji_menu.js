const Clutter = imports.gi.Clutter;
const Lang = imports.lang;
const PanelMenu = imports.ui.panelMenu;
const PopupMenu = imports.ui.popupMenu;
const Shell = imports.gi.Shell;
const St = imports.gi.St;

const Me = imports.misc.extensionUtils.getCurrentExtension();
const Convenience = Me.imports.convenience;
const Emojis = Me.imports.emojis;
const EmojiButton = Me.imports.emoji_button.EmojiButton;

const Gettext = imports.gettext.domain('ascii-emoji-buckets');
const _ = Gettext.gettext;

var EmojiMenu = new Lang.Class({
  Name: 'ASCIIEmojiMenu',
  Extends: PanelMenu.Button,

  _init: function() {
    this.parent(0, 'ASCIIEmojiMenu', false);

    let box = new St.BoxLayout();

    let toplabel = new St.Label({
      text: ';)',
      y_expand: true,
      y_align: Clutter.ActorAlign.CENTER
    });

    box.add(toplabel);
    this.actor.add_child(box);

    this.addEmojiSet(_("Emotions And Weird Ones"), Emojis.EMOTIONS, this)

    let prefsMenuItem = this.prefsMenuItem()
    this.menu.addMenuItem(prefsMenuItem);
  },

  addEmojiSet: function(title, emojiSet, menuBase) {
    let newMenuSet = new PopupMenu.PopupSubMenuMenuItem(title);

    let item, container;

    for (var i = 0; i < emojiSet.length; i++) {
      let emoji = emojiSet[i];
      if (i % 20 === 0) {
        item = new PopupMenu.PopupBaseMenuItem({});
        item.actor.track_hover = false;
        container = new St.BoxLayout({ style_class: 'menu-box' });
        item.actor.add(container, { expand: true });
        newMenuSet.menu.addMenuItem(item);
      }

      let button = new EmojiButton(emoji, menuBase)
      container.add_child(button);
    }

    menuBase.menu.addMenuItem(newMenuSet);
    let fontSize = Convenience.getSettings().get_int('font-size');
    newMenuSet.menu.box.style_class = 'emoji-size-' + fontSize;
  },

  prefsMenuItem: function() {
    let _appSys = Shell.AppSystem.get_default();
    let _prefs = _appSys.lookup_app('gnome-shell-extension-prefs.desktop');
    let item = new PopupMenu.PopupMenuItem(_("Preferences..."));
    item.connect('activate', function () {
      if (_prefs.get_state() === _prefs.SHELL_APP_STATE_RUNNING){
        _prefs.activate();
      } else {
        let info = _prefs.get_app_info();
        let timestamp = global.display.get_current_time_roundtrip();
        info.launch_uris([Me.metadata.uuid], global.create_app_launch_context(timestamp, -1));
      }
    });
    return item;
  },

  destroy: function() {
    this.parent();
  }
});
