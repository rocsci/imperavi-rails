class CreateImages < ActiveRecord::Migration
  def change
    create_table :images do |t|
      t.string  :image_uid, :null => false

      t.timestamps
    end

    add_index :images, :image_uid
  end
end
