import { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

/**
 * CommentSection component
 *
 * Displays a list of comments for a given video.  Authenticated users can
 * create a new comment, as well as edit or delete their own existing
 * comments.  Comments are refetched after each create/update/delete to keep
 * the UI in sync with the server.
 */
const CommentSection = ({ videoId }) => {
  const { currentUser } = useAuth();
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState('');

  const fetchComments = async () => {
    try {
      const response = await axios.get('/api/comments', { params: { videoId } });
      setComments(response.data);
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  };

  useEffect(() => {
    fetchComments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [videoId]);

  const handleAddComment = async () => {
    const text = newComment.trim();
    if (!text) return;
    try {
      await axios.post('/api/comments', { videoId, text });
      setNewComment('');
      fetchComments();
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  const handleEdit = (comment) => {
    setEditingId(comment._id);
    setEditText(comment.text);
  };

  const handleUpdate = async (id) => {
    const text = editText.trim();
    if (!text) return;
    try {
      await axios.put(`/api/comments/${id}`, { text });
      setEditingId(null);
      setEditText('');
      fetchComments();
    } catch (error) {
      console.error('Error updating comment:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/comments/${id}`);
      fetchComments();
    } catch (error) {
      console.error('Error deleting comment:', error);
    }
  };

  return (
    <div className="comment-section">
      <h3>Comments</h3>
      {currentUser && (
        <div className="comment-form">
          <input
            type="text"
            placeholder="Add a public comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleAddComment();
            }}
          />
          <button onClick={handleAddComment}>Comment</button>
        </div>
      )}
      <div className="comment-list">
        {comments.map((comment) => (
          <div key={comment._id} className="comment-item">
            <div className="comment-author">
              <img
                src={
                  comment.user.avatar ||
                  `https://ui-avatars.com/api/?name=${comment.user.username}&background=random`
                }
                alt={comment.user.username}
              />
              <span>{comment.user.username}</span>
            </div>
            {editingId === comment._id ? (
              <div className="comment-edit">
                <input
                  type="text"
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleUpdate(comment._id);
                  }}
                />
                <button onClick={() => handleUpdate(comment._id)}>Save</button>
                <button onClick={() => setEditingId(null)}>Cancel</button>
              </div>
            ) : (
              <div className="comment-content">
                <p>{comment.text}</p>
                <div className="comment-actions">
                  <span>{new Date(comment.timestamp).toLocaleString()}</span>
                  {currentUser && comment.user._id === currentUser.id && (
                    <>
                      <button onClick={() => handleEdit(comment)}>Edit</button>
                      <button onClick={() => handleDelete(comment._id)}>Delete</button>
                    </>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CommentSection;