# encoding: UTF-8
# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended to check this file into your version control system.

ActiveRecord::Schema.define(:version => 20120202074740) do

  create_table "images", :force => true do |t|
    t.string   "imageable_type", :null => false
    t.integer  "imageable_id",   :null => false
    t.string   "image_uid",      :null => false
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "images", ["image_uid"], :name => "index_images_on_image_uid"
  add_index "images", ["imageable_type", "imageable_id"], :name => "index_images_on_imageable_type_and_imageable_id"

  create_table "pages", :force => true do |t|
    t.string   "title",      :null => false
    t.text     "article",    :null => false
    t.datetime "created_at"
    t.datetime "updated_at"
  end

end
