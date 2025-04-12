import { test, expect, describe, beforeEach } from "@playwright/test"
const url = "http://localhost:5173"

describe("Blog list", () => {
  const user = {
    name: "test user",
    username: "test",
    password: "password"
  }
  const secondUser = {
    name: "second user",
    username: "second",
    password: "password"
  }
  const login = async (page, username, password) => {
    await page.getByLabel("username:").fill(username)
    await page.getByLabel("password:").fill(password)
    await page.getByRole("button").click()
  }
  beforeEach(async ({ page, request }) => {
    await request.get(`${url}/api/testing/reset`)
    await request.post(`${url}/api/users`, {
      data: user
    })
    await request.post(`${url}/api/users`, {
      data: secondUser
    })
    await page.goto(url)
  })

  test("Login form is shown initially", async ({ page }) => {
    await expect(page.getByRole("heading", { name: "login" })).toBeVisible()
    await expect(page.getByLabel("username:")).toBeVisible()
    await expect(page.getByLabel("password:")).toBeVisible()
    await expect(page.getByRole("button")).toBeVisible()
  })

  describe("Login", () => {
    test("User is able to login", async ({ page }) => {
      await login(page, user.username, user.password)
      await expect(page.getByRole("heading", {name: `${user.username} logged in`})).toBeVisible()
    })

    test("User isn't able to enter with incorrect credentials", async ({ page }) => {
      await login(page, "not a user", "not a password")
      await expect(page.getByRole("heading", {name: `${user.username} logged in`})).not.toBeVisible()
    })
  })

  describe("Blogs", () => {
    test("Blogs are in order", async ({ page, request }) => {
      // need to create a bunch of blogs before logging in
      let response = await request.post(`${url}/api/login`, {
        data: user
      })
      let body = await response.body()
      let token = JSON.parse(body).token
      const initialBlogs = [
        {
          title: "blog 1",
          author: "author 1",
          url: "url 1",
          likes: 0
        },
        {
          title: "blog 2",
          author: "author 2",
          url: "url 2",
          likes: 1
        },
        {
          title: "blog 3",
          author: "author 3",
          url: "url 3",
          likes: 3
        },
        {
          title: "blog 4",
          author: "author 4",
          url: "url 4",
          likes: 2
        }
      ]
      let requests = []
      for (let blog of initialBlogs) {
        let blogRequest = request.post(`${url}/api/blogs`, {
          data: blog,
          headers: {
            "Authorization": `Bearer ${token}`
          }
        })
        requests.push(blogRequest)
      }
      await Promise.all(requests)

      await page.reload()
      // now need to verify the order
      await login(page, user.username, user.password)

      const getLikes = async blog => {
        await blog.getByRole("button", { name: "show" }).click()
        const likesText = await blog.getByText("likes: ").innerText()
        let likes = Number(likesText.slice("likes: ".length))
        console.log(likes)
      }
      await page.locator(".blog").first().waitFor()
      let blogs = await page.locator(".blog").all()
      let previous
      let inOrder = true
      for (let blog of blogs) {
        let likes = await getLikes(blog)
        if (!previous) {
          previous = likes
          continue
        }
        if (likes > previous) {
          inOrder = false
          break
        }
        previous = likes
      }
      expect(inOrder).toBe(true)
    })
  })

  describe("When logged in", () => {
    const sampleBlog = {
      title: "sample blog",
      author: "sample author",
      url: "sample url"
    }
    const anotherBlog = {
      title: "another blog",
      author: "another author",
      url: "another url"
    }
    const createBlog = async (page, title, author, url) => {
      await page.getByRole("button", { name: "new note" }).click()
      await page.getByLabel("title:").fill(title)
      await page.getByLabel("author:").fill(author)
      await page.getByLabel("url:").fill(url)
      await page.getByRole("button", { name: "create" }).click()
      await page.getByText(`title: ${title}`).waitFor()
    }
    beforeEach(async ({ page }) => {
      await login(page, secondUser.username, secondUser.password)
      await createBlog(page, anotherBlog.title, anotherBlog.author, anotherBlog.url)
      await page.getByRole("button", { name: "logout" }).click()
      await login(page, user.username, user.password)
    })
    test("A new blog can be created", async ({ page }) => {
      await createBlog(page, sampleBlog.title, sampleBlog.author, sampleBlog.url)
      await page.getByText(`title: ${sampleBlog.title}`).waitFor()
      await expect(page.getByText(`title: ${sampleBlog.title}`)).toBeVisible()
    })
    test("A blog can be liked", async ({ page }) => {
      await createBlog(page, sampleBlog.title, sampleBlog.author, sampleBlog.url)
      let blogElement = await page.getByText(`title: ${sampleBlog.title}`).locator("..")
      await blogElement.getByRole("button", { name: "show" }).click()
      await blogElement.getByRole("button", { name: "like" }).click()
      await blogElement.getByText("likes: 1").waitFor()
    })
    test("A blog can be deleted by the user who added it", async ({ page }) => {
      await createBlog(page, sampleBlog.title, sampleBlog.author, sampleBlog.url)
      let blogElement = await page.getByText(`title: ${sampleBlog.title}`).locator("..")
      await blogElement.getByRole("button", { name: "show" }).click()
      page.on("dialog", dialog => dialog.accept())
      await blogElement.getByRole("button", { name: "remove" }).click()
    })
    test("remove button is not visible to user that didn't add a post", async ({ page }) => {
      let blogElement = await page.getByText(`text: ${anotherBlog.title}`).locator("..")
      await expect(blogElement.getByRole("button", { name: "remove" })).not.toBeVisible()
    })
  })
})
