import React, { useEffect, useState } from 'react';
import { Card, CardHeader, CardBody, Button } from '@nextui-org/react';
import { Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { apiService, Post } from '../services/apiService';
import PostList from '../components/PostList';

const DraftsPage: React.FC = () => {
  const [drafts, setDrafts] = useState<Post[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let active = true;
    const fetchDrafts = async () => {
      try {
        setLoading(true);
        const response = await apiService.getDrafts();
        if (active) { setDrafts(response); setError(null); }
      } catch {
        if (active) setError('Failed to load drafts. Please sign in again and retry.');
      } finally {
        if (active) setLoading(false);
      }
    };
    void fetchDrafts();
    return () => { active = false; };
  }, [reloadKey]);

  return (
    <div className="max-w-4xl mx-auto px-4">
      <Card>
        <CardHeader className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">My Drafts</h1>
          <Button as={Link} to="/posts/new" color="primary" startContent={<Plus size={16} />}>New Post</Button>
        </CardHeader>
        <CardBody>
          {error && <div role="alert" className="mb-4 rounded-lg bg-red-50 p-4 text-red-700">{error}</div>}
          <PostList posts={drafts} loading={loading} error={null} page={1} sortBy="updatedAt,desc"
            onPageChange={() => undefined} onSortChange={() => undefined} showStatus />
          {drafts?.length === 0 && !loading && (
            <div className="py-8 text-center text-default-500">
              <p>You don't have any draft posts yet.</p>
              <Button as={Link} to="/posts/new" color="primary" variant="flat" className="mt-4">Create your first post</Button>
            </div>
          )}
          <button className="sr-only" onClick={() => setReloadKey((key) => key + 1)}>Refresh drafts</button>
        </CardBody>
      </Card>
    </div>
  );
};
export default DraftsPage;
