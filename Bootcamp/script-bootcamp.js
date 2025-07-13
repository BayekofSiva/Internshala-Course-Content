async function getSortedPopularComments() 
{
        try 
        {
                const response = await fetch('https://dummyjson.com/comments');
                const { comments } = await response.json();
                
                // Filtering comments with >5 likes
                const popularComments = comments
                .filter(comment => comment.likes > 5)
                .map(comment => ({
                        username: comment.user.username,
                        body: comment.body,
                        likes: comment.likes
                }));
                
                // Sorting by likes
                popularComments.sort((a, b) => a.likes - b.likes);
                
                // Displaying Data
                
                console.log("Comments with >5 likes (sorted by least to most):");
                console.log("-----------------------------------------------");
                popularComments.forEach((comment, index) => {
                console.log(`${index + 1}. [${comment.likes} likes] @${comment.username}`);
                console.log(`   "${comment.body}"\n`);
                });
                
                return popularComments;
        } 
        
        catch (error) 
        {
                console.error('Failed to fetch comments:', error);
        }
}

getSortedPopularComments();