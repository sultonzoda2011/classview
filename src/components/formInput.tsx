import React from 'react'
import { Controller, type FieldError,  } from 'react-hook-form'

interface IFormInputProps {
  name: string
  placeholder: string
  type: string
  control: any
  icon?: React.ComponentType<React.SVGProps<SVGSVGElement>>
  error?: FieldError
}

const FormInput = ({ name, placeholder, type, control, icon: Icon, error }: IFormInputProps) => {
  return (
    <div className="flex flex-col space-y-1 w-full">
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <>
            <div className="relative w-full">
              {Icon && (
                <Icon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 w-5 h-5 transition-colors duration-200" />
              )}
              <input
                {...field}
                placeholder={placeholder}
                type={type}
                className={`w-full ${
                  Icon ? 'pl-10' : 'pl-4'
                } pr-4 py-2 sm:py-3 border rounded-lg transition duration-200 shadow-sm
                  ${
                    error
                      ? 'border-red-500 focus:border-red-500 focus:ring-red-300'
                      : 'border-gray-300 dark:border-gray-700 focus:border-black dark:focus:border-gray-100 focus:ring-black/20 dark:focus:ring-gray-100/20'
                  }
                  bg-white dark:bg-gray-800 text-black dark:text-gray-100 text-sm sm:text-base placeholder-gray-400 dark:placeholder-gray-500`}
              />
            </div>
            {error && (
              <span className="text-red-500 text-xs mt-1">{error.message}</span>
            )}
          </>
        )}
      />
    </div>
  )
}

export default FormInput
