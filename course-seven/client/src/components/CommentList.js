import React, { useEffect, useState } from 'react';
import axios from '../api/axios';

/**
 * CommentList manages the fetching and display of comments for a video.  It
 * renders a form for adding new comments (only visible when `currentUser`
 * prop is present) and provides editing/deleting actions for comments
 * created by the current user.
 */
const CommentList = ({ videoId, currentUser }) => {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [text, setText] = useState('');
  const [editId, setEditId] = useState(null);
  const [editText, setEditText] = useState('');

  // Fetch comments on mount or when videoId changes
  useEffect(() => {
    const fetchComments = async () => {
      try {
        const res = await axios.get(`/api/comments/${videoId}`);
        setComments(res.data);
      } catch (err) {
        setComments([]);
      } finally {
        setLoading(false);
      }
    };
    fetchComments();
  }, [videoId]);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    try {
      const res = await axios.post(
        `/api/comments/${videoId}`,
        { text },
        { withCredentials: true }
      );
      setComments((prev) => [res.data, ...prev]);
      setText('');
    } catch (err) {
      console.error(err);
    }
  };

  const handleEdit = async (commentId) => {
    if (!editText.trim()) return;
    try {
      const res = await axios.put(
        `/api/comments/${commentId}`,
        { text: editText },
        { withCredentials: true }
      );
      setComments((prev) => prev.map((c) => (c._id === commentId ? res.data : c)));
      setEditId(null);
      setEditText('');
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (commentId) => {
    try {
      await axios.delete(`/api/comments/${commentId}`, { withCredentials: true });
      setComments((prev) => prev.filter((c) => c._id !== commentId));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div style={{ marginTop: '2rem' }}>
      <h3>Comments</h3>
      {/* Comment form */}
      {currentUser && (
        <form onSubmit={editId ? (e) => { e.preventDefault(); handleEdit(editId); } : handleAdd} style={{ marginBottom: '1rem' }}>
          <textarea
            placeholder="Add a comment..."
            value={editId ? editText : text}
            onChange={(e) => (editId ? setEditText(e.target.value) : setText(e.target.value))}
            rows={2}
            style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: `1px solid var(--muted)`, resize: 'vertical' }}
          />
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
            {editId && (
              <button
                type="button"
                onClick={() => {
                  setEditId(null);
                  setEditText('');
                }}
                style={{ marginRight: '0.5rem', padding: '0.25rem 0.5rem', borderRadius: '4px', backgroundColor: 'var(--muted)', color: 'var(--bg)' }}
              >
                Cancel
              </button>
            )}
            <button
              type="submit"
              style={{ padding: '0.25rem 0.5rem', borderRadius: '4px', backgroundColor: 'var(--primary)', color: 'white' }}
            >
              {editId ? 'Save' : 'Comment'}
            </button>
          </div>
        </form>
      )}
      {loading ? (
        <p>Loading comments...</p>
      ) : comments.length === 0 ? (
        <p>No comments yet.</p>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {comments.map((comment) => (
            <li key={comment._id} style={{ marginBottom: '1rem', borderBottom: `1px solid var(--muted)`, paddingBottom: '0.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <strong>{comment.username || comment.userId}</strong>
                  <span style={{ marginLeft: '0.5rem', color: 'var(--muted)', fontSize: '0.8rem' }}>
                    {new Date(comment.createdAt).toLocaleString()}
                  </span>
                </div>
                {currentUser && currentUser._id === comment.userId && (
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button
                      onClick={() => {
                        setEditId(comment._id);
                        setEditText(comment.text);
                      }}
                      style={{ fontSize: '0.8rem', color: 'var(--primary)' }}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(comment._id)}
                      style={{ fontSize: '0.8rem', color: 'var(--accent)' }}
                    >
                      Delete
                    </button>
                  </div>
                )}
              </div>
              <p style={{ margin: '0.25rem 0' }}>{comment.text}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default CommentList;