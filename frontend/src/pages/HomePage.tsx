import React, { useEffect, useState } from 'react';
import { Card, CardHeader, CardBody, Tabs, Tab } from '@nextui-org/react';
import { apiService, Post, Category, Tag } from '../services/apiService';
import PostList from '../components/PostList';

const HomePage: React.FC = () => {
  const [posts, setPosts] = useState<Post[] | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [sortBy, setSortBy] = useState('createdAt,desc');
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>();
  const [selectedTag, setSelectedTag] = useState<string | undefined>();

  useEffect(() => {
    let active = true;
    const fetchData = async () => {
      try {
        setLoading(true);
        const [postResults, categoryResults, tagResults] = await Promise.all([
          apiService.getPosts({ categoryId: selectedCategory, tagId: selectedTag }),
          apiService.getCategories(),
          apiService.getTags()
        ]);
        if (active) { setPosts(postResults); setCategories(categoryResults); setTags(tagResults); setError(null); }
      } catch {
        if (active) setError('Failed to load blog content. Check that the backend is running and try again.');
      } finally { if (active) setLoading(false); }
    };
    void fetchData();
    return () => { active = false; };
  }, [selectedCategory, selectedTag]);

  const changeCategory = (key: React.Key) => {
    setSelectedCategory(key === 'all' ? undefined : String(key));
    setPage(1);
  };

  return <div className="mx-auto max-w-6xl space-y-6 px-4">
    <Card className="mb-6 px-2"><CardHeader><div><p className="text-sm font-semibold uppercase tracking-widest text-indigo-600">Ideas worth sharing</p><h1 className="text-2xl font-bold">Latest blog posts</h1></div></CardHeader>
      <CardBody className="gap-4">
        <Tabs aria-label="Filter posts by category" selectedKey={selectedCategory ?? 'all'} onSelectionChange={changeCategory} variant="underlined" classNames={{ tabList: 'gap-6', cursor: 'w-full bg-primary' }}>
          <Tab key="all" title="All posts" />{categories.map(category => <Tab key={category.id} title={`${category.name} (${category.postCount ?? 0})`} />)}
        </Tabs>
        {tags.length > 0 && <div className="flex flex-wrap gap-2">{tags.map(tag => <button type="button" key={tag.id} aria-pressed={selectedTag === tag.id} onClick={() => { setSelectedTag(current => current === tag.id ? undefined : tag.id); setPage(1); }} className={`rounded-full px-3 py-1 text-sm ${selectedTag === tag.id ? 'bg-primary text-white' : 'bg-default-100 hover:bg-default-200'}`}>{tag.name} ({tag.postCount ?? 0})</button>)}</div>}
      </CardBody>
    </Card>
    {error && <div role="alert" className="rounded-lg bg-red-50 p-4 text-red-700">{error}</div>}
    <PostList posts={posts} loading={loading} error={null} page={page} sortBy={sortBy} onPageChange={setPage} onSortChange={setSortBy} />
  </div>;
};
export default HomePage;
