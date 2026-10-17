import React, { useEffect, useState } from "react";
import { Card, CardHeader, CardBody, Button, Input, Table, TableHeader, TableBody, TableColumn, TableRow, TableCell, useDisclosure, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Chip, Tooltip } from "@nextui-org/react";
import { Plus, Trash2, X } from "lucide-react";
import { apiService, Tag } from "../services/apiService";

const TagsPage: React.FC<{ isAuthenticated: boolean }> = ({ isAuthenticated }) => {
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newTags, setNewTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const fetchTags = async () => {
    try { setLoading(true); setTags(await apiService.getTags()); setError(null); }
    catch (err) { setError((err as { message?: string }).message || "Failed to load tags."); }
    finally { setLoading(false); }
  };
  useEffect(() => { void fetchTags(); }, []);

  const addInputTag = () => {
    const value = tagInput.trim().toLowerCase();
    if (value && !newTags.includes(value) && newTags.length < 10) setNewTags(current => [...current, value]);
    setTagInput("");
  };
  const handleAddTags = async () => {
    const input = tagInput.trim().toLowerCase();
    const names = [...new Set([...newTags, ...(input ? [input] : [])])];
    if (!names.length) { setError("Enter at least one tag."); return; }
    if (names.some(name => name.length < 2 || name.length > 30 || !/^[\w\s-]+$/.test(name))) { setError("Tags must be 2–30 characters and contain only letters, numbers, spaces, or hyphens."); return; }
    try { setIsSubmitting(true); setError(null); await apiService.createTags(names); await fetchTags(); setNewTags([]); setTagInput(""); onClose(); }
    catch (err) { setError((err as { message?: string }).message || "Failed to create tags."); }
    finally { setIsSubmitting(false); }
  };
  const handleDelete = async (tag: Tag) => {
    if (!window.confirm(`Delete tag "${tag.name}"?`)) return;
    try { await apiService.deleteTag(tag.id); await fetchTags(); }
    catch (err) { setError((err as { message?: string }).message || "Could not delete tag. Tags with posts cannot be deleted."); }
  };

  return <div className="mx-auto max-w-4xl px-4"><Card><CardHeader className="flex items-center justify-between"><h1 className="text-2xl font-bold">Tags</h1>{isAuthenticated && <Button color="primary" startContent={<Plus size={16} />} onClick={onOpen}>Add tags</Button>}</CardHeader><CardBody>
    {error && <div role="alert" className="mb-4 rounded-lg bg-red-50 p-4 text-red-700">{error}</div>}
    <Table aria-label="Tags table"><TableHeader><TableColumn>NAME</TableColumn><TableColumn>POST COUNT</TableColumn><TableColumn>ACTIONS</TableColumn></TableHeader><TableBody isLoading={loading} loadingContent={<div>Loading tags…</div>} emptyContent={!loading ? "No tags yet." : null}>
      {tags.map(tag => <TableRow key={tag.id}><TableCell>{tag.name}</TableCell><TableCell>{tag.postCount ?? 0}</TableCell><TableCell>{isAuthenticated ? <Tooltip content={tag.postCount ? "Cannot delete a tag that has posts" : "Delete tag"}><Button isIconOnly aria-label={`Delete ${tag.name}`} variant="flat" color="danger" size="sm" onClick={() => handleDelete(tag)} isDisabled={(tag.postCount ?? 0) > 0}><Trash2 size={16} /></Button></Tooltip> : <span>—</span>}</TableCell></TableRow>)}
    </TableBody></Table>
  </CardBody></Card>
  <Modal isOpen={isOpen} onClose={() => { setNewTags([]); setTagInput(""); onClose(); }}><ModalContent><ModalHeader>Add tags</ModalHeader><ModalBody><Input label="Tag name" placeholder="Type a tag and press Enter" value={tagInput} onChange={event => setTagInput(event.target.value)} onKeyDown={event => { if (event.key === "Enter" || event.key === ",") { event.preventDefault(); addInputTag(); } }} /><div className="flex flex-wrap gap-2">{newTags.map(tag => <Chip key={tag} onClose={() => setNewTags(current => current.filter(item => item !== tag))} variant="flat" endContent={<X size={14} />}>{tag}</Chip>)}</div></ModalBody><ModalFooter><Button variant="flat" onClick={() => { setNewTags([]); setTagInput(""); onClose(); }}>Cancel</Button><Button color="primary" onClick={handleAddTags} isLoading={isSubmitting} isDisabled={!newTags.length && !tagInput.trim()}>Add tags</Button></ModalFooter></Modal>
  </div>;
};
export default TagsPage;
