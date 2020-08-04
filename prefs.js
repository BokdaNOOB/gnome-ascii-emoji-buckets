const GObject = imports.gi.GObject;
const Gtk = imports.gi.Gtk;
const Lang = imports.lang;

const Me = imports.misc.extensionUtils.getCurrentExtension();
const Convenience = Me.imports.convenience;

const Gettext = imports.gettext.domain('ascii-emoji-buckets');
const _ = Gettext.gettext;

function init() {
  Convenience.initTranslations("ascii-emoji-buckets");
}

const EmojiBucketsPrefsWidget = new GObject.Class({
  Name: 'ASCIIEmojiBuckets.Prefs.Widget',
  GTypeName: 'ASCIIEmojiBucketsPrefsWidget',
  Extends: Gtk.Grid,

  _init: function(params) {
    this.parent(params);
    this.margin = this.row_spacing = this.column_spacing = 20;

    this._settings = Convenience.getSettings();

    this.attach(new Gtk.Label({ label: _("Font size") + " " + "(" + _("requires restart") +")" }), 0, 0, 1, 1);
    let fontSize = Gtk.Scale.new_with_range(Gtk.Orientation.HORIZONTAL, 1, 3, 1);
    fontSize.set_value(this._settings.get_int('font-size'));
    fontSize.set_digits(0);
    fontSize.set_hexpand(true);
    fontSize.connect('value-changed', Lang.bind(this, this._onFontSizeChanged));
    this.attach(fontSize, 1, 0, 1, 1);
  },

  _onFontSizeChanged: function (fontSize) {
    this._settings.set_int('font-size', fontSize.get_value());
  }
});

function buildPrefsWidget() {
  let widget = new EmojiBucketsPrefsWidget();
  widget.show_all();
  return widget;
}
