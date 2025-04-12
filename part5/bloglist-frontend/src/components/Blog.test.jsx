import { render, screen } from "@testing-library/react"
import { test, expect, vi } from "vitest"
import userEvent from "@testing-library/user-event"
import Blog from "./Blog"

const user = {
  name: "Luke Eades",
  username: "Luke Eades",
  id: "verycoolid"
}
const sampleBlog = {
  title: "Luke Eades's Blog",
  author: "Luke Eades",
  url: "Luke Eades's Blog",
  user,
  id: "id"
}

test("renders only the title and author by default", () => {
  const { container } = render(<Blog blog={sampleBlog} user={user} />)
  expect(container).toHaveTextContent("Luke Eades's Blog")
  expect(container).not.toHaveTextContent("added by:")
  expect(container).not.toHaveTextContent("url:")
})

test("url and number of likes are shown once the button is clicked", async () => {
  const { container } = render(<Blog blog={sampleBlog} user={user} />)
  // register a click
  const button = container.querySelector(".toggle-button")
  await userEvent.click(button)
  expect(container).toHaveTextContent("likes:")
  expect(container).toHaveTextContent("url:")
})

test("when the like button is clicked twice the update callback is called twice as well", async () => {
  const mockHandler = vi.fn()
  const { container } = render(<Blog blog={sampleBlog} user={user} addLike={mockHandler}/>)
  const toggleButton = container.querySelector(".toggle-button")
  await userEvent.click(toggleButton)
  const likeButton = container.querySelector(".like-button")
  await userEvent.click(likeButton)
  await userEvent.click(likeButton)
  expect(mockHandler.mock.calls).toHaveLength(2)
})
