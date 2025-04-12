import Blogform from "./Blogform"
import { test, vi, expect } from "vitest"
import { render } from "@testing-library/react"
import userEvent from "@testing-library/user-event"


test("when the form is submitted with information the details are correctly received by the handler", async () => {
  const blogDetails = {
    title: "Luke Eades's Blog",
    author: "Luke Eades",
    url: "Luke Eades's Blog URL"
  }
  const fakeHandler = vi.fn()
  const user = userEvent.setup()
  const { container } = render(<Blogform handleForm={fakeHandler} />)
  const titleInput = container.querySelector("#title")
  const authorInput = container.querySelector("#author")
  const urlInput = container.querySelector("#url")
  const formButton = container.querySelector("button")
  await user.type(titleInput, blogDetails.title)
  await user.type(authorInput, blogDetails.author)
  await user.type(urlInput, blogDetails.url)
  await user.click(formButton)
  console.log(fakeHandler.mock.calls)
  expect(fakeHandler.mock.calls).toHaveLength(1)
  expect(fakeHandler.mock.calls[0][0].title).toBe(blogDetails.title)
  expect(fakeHandler.mock.calls[0][0].author).toBe(blogDetails.author)
  expect(fakeHandler.mock.calls[0][0].url).toBe(blogDetails.url)
})