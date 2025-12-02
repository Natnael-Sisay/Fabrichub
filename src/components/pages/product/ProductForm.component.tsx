"use client";

import React, { useEffect, useState } from "react";
import { Formik, FormikHelpers } from "formik";
import { toFormikValidationSchema } from "zod-formik-adapter";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { XIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldError,
} from "@/components/ui/field";
import { Product, ProductFormMode, ProductFormValues } from "@/types";
import { ProductSchema } from "@/schemas";
import { fetchCategories } from "@/lib/api";
import { normalizeCategories, formatCategoryLabel } from "@/utils";

interface ProductFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: ProductFormMode;
  product?: Product;
  onSubmit: (values: ProductFormValues) => Promise<void> | void;
}

const ProductFormComponent: React.FC<ProductFormProps> = ({
  open,
  onOpenChange,
  mode,
  product,
  onSubmit,
}) => {
  const isEdit = mode === ProductFormMode.EDIT;
  const [categories, setCategories] = useState<string[]>([]);

  useEffect(() => {
    if (open) {
      fetchCategories()
        .then((cats) => {
          const categoriesArray = Array.isArray(cats) ? cats : [];
          const normalized = normalizeCategories(categoriesArray);
          setCategories(normalized.map((c) => c.value));
        })
        .catch(() => {
          setCategories([]);
        });
    }
  }, [open]);

  const initialValues: ProductFormValues = {
    title: product?.title ?? "",
    description: product?.description ?? "",
    price: product?.price ?? 0,
    stock: product?.stock ?? 0,
    brand: product?.brand ?? "",
    category: product?.category ?? "",
  };

  const handleSubmit = async (
    values: ProductFormValues,
    actions: FormikHelpers<ProductFormValues>
  ) => {
    actions.setSubmitting(true);
    try {
      await onSubmit(values);
      onOpenChange(false);
    } finally {
      actions.setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-w-2xl max-h-[90vh] text-primary  overflow-y-auto"
        showCloseButton={false}
      >
        <DialogClose
          className="absolute top-4 right-4 rounded-lg opacity-70 bg-destructive/20 text-destructive hover:cursor-pointer p-1  transition-opacity hover:opacity-100 focus:outline-none focus:ring-0 disabled:pointer-events-none z-10"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onOpenChange(false);
          }}
        >
          <XIcon className="size-4" />
          <span className="sr-only">Close</span>
        </DialogClose>
        <DialogHeader>
          <DialogTitle>
            {isEdit ? "Edit Product" : "Create Product"}
          </DialogTitle>
        </DialogHeader>

        <Formik
          initialValues={initialValues}
          validationSchema={toFormikValidationSchema(ProductSchema)}
          onSubmit={handleSubmit}
          enableReinitialize
        >
          {({
            values,
            errors,
            touched,
            handleChange,
            handleBlur,
            handleSubmit,
            isSubmitting,
            setFieldValue,
          }) => (
            <form onSubmit={handleSubmit}>
              <FieldGroup>
                <Field>
                  <FieldLabel htmlFor="title">
                    Title <span className="text-destructive">*</span>
                  </FieldLabel>
                  <Input
                    id="title"
                    name="title"
                    placeholder="Enter product title"
                    value={values.title}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                  <FieldError
                    errors={
                      touched.title && errors.title
                        ? [{ message: errors.title as string }]
                        : undefined
                    }
                  />
                </Field>

                <Field>
                  <FieldLabel htmlFor="description">Description</FieldLabel>
                  <Textarea
                    id="description"
                    name="description"
                    placeholder="Enter product description"
                    rows={4}
                    value={values.description || ""}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                  <FieldError
                    errors={
                      touched.description && errors.description
                        ? [{ message: errors.description as string }]
                        : undefined
                    }
                  />
                </Field>

                <div className="grid grid-cols-2 gap-4">
                  <Field>
                    <FieldLabel htmlFor="price">
                      Price <span className="text-destructive">*</span>
                    </FieldLabel>
                    <Input
                      id="price"
                      name="price"
                      type="number"
                      step="0.01"
                      min="0"
                      placeholder="0.00"
                      value={values.price || ""}
                      onChange={(e) => {
                        const value = parseFloat(e.target.value) || 0;
                        setFieldValue("price", value);
                      }}
                      onBlur={handleBlur}
                    />
                    <FieldError
                      errors={
                        touched.price && errors.price
                          ? [{ message: errors.price as string }]
                          : undefined
                      }
                    />
                  </Field>

                  <Field>
                    <FieldLabel htmlFor="stock">
                      Stock <span className="text-destructive">*</span>
                    </FieldLabel>
                    <Input
                      id="stock"
                      name="stock"
                      type="number"
                      min="0"
                      placeholder="0"
                      value={values.stock || ""}
                      onChange={(e) => {
                        const value = parseInt(e.target.value, 10) || 0;
                        setFieldValue("stock", value);
                      }}
                      onBlur={handleBlur}
                    />
                    <FieldError
                      errors={
                        touched.stock && errors.stock
                          ? [{ message: errors.stock as string }]
                          : undefined
                      }
                    />
                  </Field>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <Field>
                    <FieldLabel htmlFor="brand">Brand</FieldLabel>
                    <Input
                      id="brand"
                      name="brand"
                      placeholder="Enter brand name"
                      value={values.brand || ""}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                    <FieldError
                      errors={
                        touched.brand && errors.brand
                          ? [{ message: errors.brand as string }]
                          : undefined
                      }
                    />
                  </Field>

                  <Field>
                    <FieldLabel htmlFor="category">Category</FieldLabel>
                    <Select
                      id="category"
                      name="category"
                      value={values.category || ""}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    >
                      <option value="">Select a category</option>
                      {categories.map((category) => (
                        <option key={category} value={category}>
                          {formatCategoryLabel(category)}
                        </option>
                      ))}
                    </Select>
                    <FieldError
                      errors={
                        touched.category && errors.category
                          ? [{ message: errors.category as string }]
                          : undefined
                      }
                    />
                  </Field>
                </div>

                <Field>
                  <DialogFooter>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => onOpenChange(false)}
                      disabled={isSubmitting}
                    >
                      Cancel
                    </Button>
                    <Button type="submit" disabled={isSubmitting}>
                      {isSubmitting
                        ? isEdit
                          ? "Updating..."
                          : "Creating..."
                        : isEdit
                        ? "Update"
                        : "Create"}
                    </Button>
                  </DialogFooter>
                </Field>
              </FieldGroup>
            </form>
          )}
        </Formik>
      </DialogContent>
    </Dialog>
  );
};

export function ProductForm(props: ProductFormProps) {
  return <ProductFormComponent {...props} />;
}
