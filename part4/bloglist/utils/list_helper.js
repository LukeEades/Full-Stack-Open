const dummy = (blogs) => {
    return 1
}

const totalLikes = (blogs) => {
    return blogs.reduce((acc, blog) => {
        return acc + blog.likes
    }, 0)
}

const favoriteBlog = (blogs) => {
    if (blogs.length === 0) {
        return null
    }
    return blogs.reduce((acc, blog) => {
        if (acc.likes > blog) return acc
        return blog
    })
}

const mostBlogs = (blogs) => {
    if (!blogs.length) return null
    let author = new Map()
    blogs.forEach(blog => {
        if (!author.get(blog.author)) {
            author.set(blog.author, {
                author: blog.author,
                blogs: 1
            })
        } else {
            author.get(blog.author).blogs++
        }
    })
    let most
    author.forEach((val, key) => {
        if (!most || val.blogs > most.blogs) {
            most = val
        }
    })
    return most
}

const mostLikes = (blogs) => {
    if (!blogs.length) return null
    let author = new Map()
    blogs.forEach(blog => {
        author.set(blog.author, (author.get(blog.author)|| 0) + blog.likes)
    })
    let most
    author.forEach((val, key) => {
        if (!most || val > most.likes) {
            most = {
                author: key,
                likes: val
            }
        }
    })
    return most
}

module.exports = {
    dummy,
    totalLikes,
    favoriteBlog,
    mostBlogs,
    mostLikes
}