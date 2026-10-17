import React, { useEffect, useState } from "react";
import { Card, CardHeader, CardBody, Button, Input, Table, TableHeader, TableBody, TableColumn, TableRow, TableCell, useDisclosure, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Tooltip } from "@nextui-org/react";
import { Plus, Edit2, Trash2 } from "lucide-react";
import { apiService, Category } from "../services/apiService";

const CategoriesPage: React.FC<{ isAuthenticated: boolean }> = ({ isAuthenticated }) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const fetchCategories = async () => {
    try { setLoading(true); setCategories(await apiService.getCategories()); setError(null); }
    catch (err) { setError((err as { message?: string }).message || "Failed to load categories."); }
    finally { setLoading(false); }
  };
  useEffect(() => { void fetchCategories(); }, []);

  const handleAddEdit = async () => {
    if (!newCategoryName.trim()) { setError("Enter a category name."); return; }
    try {
      setIsSubmitting(true); setError(null);
      if (editingCategory) await apiService.updateCategory(editingCategory.id, newCategoryName.trim());
      else await apiService.createCategory(newCategoryName.trim());
      await fetchCategories(); closeModal();
    } catch (err) { setError((err as { message?: string }).message || "Could not save category."); }
    finally { setIsSubmitting(false); }
  };
  const handleDelete = async (category: Category) => {
    if (!window.confirm(`Delete category "${category.name}"?`)) return;
    try { setLoading(true); await apiService.deleteCategory(category.id); await fetchCategories(); }
    catch (err) { setError((err as { message?: string }).message || "Could not delete category. Categories with posts cannot be deleted."); }
    finally { setLoading(false); }
  };
  const closeModal = () => { setEditingCategory(null); setNewCategoryName(""); onClose(); };
  const openEdit = (category: Category) => { setEditingCategory(category); setNewCategoryName(category.name); onOpen(); };
  const openAdd = () => { setEditingCategory(null); setNewCategoryName(""); onOpen(); };

  return <div className="mx-auto max-w-4xl px-4"><Card><CardHeader className="flex items-center justify-between"><h1 className="text-2xl font-bold">Categories</h1>{isAuthenticated && <Button color="primary" startContent={<Plus size={16} />} onClick={openAdd}>Add category</Button>}</CardHeader><CardBody>
    {error && <div role="alert" className="mb-4 rounded-lg bg-red-50 p-4 text-red-700">{error}</div>}
    <Table aria-label="Categories table"><TableHeader><TableColumn>NAME</TableColumn><TableColumn>POST COUNT</TableColumn><TableColumn>ACTIONS</TableColumn></TableHeader>
      <TableBody isLoading={loading} loadingContent={<div>Loading categories…</div>} emptyContent={!loading ? "No categories yet." : null}>
        {categories.map(category => <TableRow key={category.id}><TableCell>{category.name}</TableCell><TableCell>{category.postCount ?? 0}</TableCell><TableCell>{isAuthenticated ? <div className="flex gap-2">
          <Button isIconOnly aria-label={`Edit ${category.name}`} variant="flat" size="sm" onClick={() => openEdit(category)}><Edit2 size={16} /></Button>
          <Tooltip content={category.postCount ? "Cannot delete a category that has posts" : "Delete category"}><Button isIconOnly aria-label={`Delete ${category.name}`} variant="flat" color="danger" size="sm" onClick={() => handleDelete(category)} isDisabled={(category.postCount ?? 0) > 0}><Trash2 size={16} /></Button></Tooltip>
        </div> : <span>—</span>}</TableCell></TableRow>)}
      </TableBody>
    </Table>
  </CardBody></Card>
  <Modal isOpen={isOpen} onClose={closeModal}>
    <ModalContent>
      <ModalHeader>{editingCategory ? "Edit category" : "Add category"}</ModalHeader>
      <ModalBody><Input autoFocus label="Category name" value={newCategoryName} onChange={event => setNewCategoryName(event.target.value)} isRequired maxLength={50} /></ModalBody>
      <ModalFooter><Button variant="flat" onClick={closeModal}>Cancel</Button><Button color="primary" onClick={handleAddEdit} isLoading={isSubmitting}>{editingCategory ? "Save changes" : "Add category"}</Button></ModalFooter>
    </ModalContent>
  </Modal>
  </div>;
};
export default CategoriesPage;
