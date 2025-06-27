# React Query `useQuery` Explanation for Beginners

This note explains the use of `useQuery` from React Query (TanStack Query) with a beginner-friendly example.

## ✅ Code Example

```js
const { data, isLoading, isError } = useQuery({
  queryKey: ['todos'],
  queryFn: async () => {
    const res = await fetch('https://jsonplaceholder.typicode.com/todos/1');
    if (!res.ok) throw new Error('Network response was not ok');
    return res.json();
  },
});

console.log(data);
```
```js
🔍 What is useQuery?
useQuery is a hook from React Query that:
Fetches data from an API
Caches the result
Handles loading, error, and success states
Can automatically re-fetch when needed

🔑 Breakdown of the Code
queryKey: ['todos']   this is name of the query
Unique identifier for this query.
Used for caching, refetching, and invalidation.
Must be an array.

queryFn: async () => {...}
The actual function that fetches data.
Uses fetch() to get data from a URL.
Checks if the response is OK.
Converts the response to JSON.

```
Destructuring the Result
```js
const { data, isLoading, isError } = useQuery(...);

- data: The fetched data (once loaded).
- isLoading: true when data is being fetched.
- isError: true if there's a network or API error.


🧠 What's Happening?
When the component loads, React Query runs the queryFn.
While fetching, isLoading is true.
After success, data contains the result.
If fetch fails, isError becomes true.
You can use console.log(data) to see the result.

```
