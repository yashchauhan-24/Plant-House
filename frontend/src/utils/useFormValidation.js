import { useEffect, useRef } from "react";
import $ from "jquery";
import "jquery-validation";

/**
 * Custom hook for jQuery Validation integration with React forms
 * @param {Object} validationRules - Validation rules configuration
 * @param {Function} onSubmit - Callback function when form is submitted with valid data
 */
const useFormValidation = (validationRules, onSubmit) => {
  const formRef = useRef(null);

  useEffect(() => {
    if (formRef.current) {
      // Destroy existing validator if present
      const existingValidator = $(formRef.current).data("validator");
      if (existingValidator) {
        existingValidator.destroy();
      }

      // Initialize jQuery Validation
      $(formRef.current).validate({
        rules: validationRules.rules || {},
        messages: validationRules.messages || {},
        errorElement: "span",
        errorClass: "text-red-500 text-xs font-semibold mt-1 block",
        errorPlacement: function (error, element) {
          error.insertAfter(element);
        },
        highlight: function (element) {
          $(element).addClass("border-red-500");
          $(element).removeClass("border-[#d7eadb]");
        },
        unhighlight: function (element) {
          $(element).removeClass("border-red-500");
          $(element).addClass("border-[#d7eadb]");
        },
        submitHandler: function (form) {
          if (onSubmit) {
            onSubmit();
          }
          return false;
        },
      });
    }

    return () => {
      if (formRef.current) {
        const validator = $(formRef.current).data("validator");
        if (validator) {
          validator.destroy();
        }
      }
    };
  }, [onSubmit]);

  return formRef;
};

export default useFormValidation;
