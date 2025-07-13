async function getComments() {
        try {
                const response = await fetch('https://dummyjson.com/comments');
                const { comments } = await response.json();
                comments.forEach(({ body }, i) => console.log(`${i + 1}. ${body}`));
        } 
        catch (error) 
        {
                console.error('Failed to fetch comments:', error);
        }
}

getComments();