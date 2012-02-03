module ImperaviRails
  module ControllerMethods
    extend ActiveSupport::Concern

    module ClassMethods

      # TODO Add functionality for non-polymorphic models
      def bind_imperavi_images_to(name, options = {})
        raise ArgumentError, "You should specify :with option" unless options[:with]

        unless options.has_key?(:only) || options.has_key?(:except)
          options[:only] = [:create, :update]
        end

        klass = options[:with]
        options[:with] = options[:with].to_s.tableize

        before_filter options do
          if params[name.to_sym]["#{options[:with]}_attributes"].try(:[], "#{options[:as]}_id")
            @_imperavi_images_attributes = params[name.to_sym]["#{options[:with]}_attributes"]
            params[name.to_sym].delete("#{options[:with]}_attributes")
          end
        end

        after_filter options do
          if @_imperavi_images_attributes
            klass_instance = klass.find(@_imperavi_images_attributes[:id])
            klass_instance.update_attributes(@_imperavi_images_attributes)
          end
        end
      end

    end
  end
end