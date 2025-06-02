// src/components/admin/ProductForm.tsx
import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import CreateProductForm from "./CreateProductForm";

// Este componente ahora simplemente debe montar CreateProductForm
export default function ProductForm() {
  return (
    <div className="max-w-3xl mx-auto">
      <CreateProductForm />
    </div>
  );
}