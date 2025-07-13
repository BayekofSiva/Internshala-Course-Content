async function getPopularComments() {
        try {
                const response = await fetch('https://dummyjson.com/comments');
                const { comments } = await response.json();
                
                // Filtering comments with more than 5 likes & using map to get usernames
                const popularComments = comments
                .filter(comment => comment.likes > 5)
                .map(({ body, user, likes }) => ({
                        username: user.username,
                        body,
                        likes
                }));
                
                // Displaying the Data
                console.log("Popular Comments (likes > 5):");
                popularComments.forEach((comment, index) => {
                console.log(`${index + 1}. Username: ${comment.username}`);
                console.log(`   Comment: ${comment.body}`);
                console.log(`   Likes: ${comment.likes}\n`);
                });
                
                return popularComments;
        } 
        catch (error) {
                console.error('Failed to fetch comments:', error);
        }
}

getPopularComments();