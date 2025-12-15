export async function handler(request) {
  const GRAPHQL_URL =
    'https://author-p597-e1803019.adobeaemcloud.com/graphql/execute.json/GMR/news-list';

  try {
    const response = await fetch(GRAPHQL_URL, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('GraphQL request failed');
    }

    const result = await response.json();

    // Adjust this mapping based on your CF model
    const items =
      result?.data?.newsList?.items?.map((item) => ({
        title: item.title,
        description: item.description?.plaintext,
        image: item.image?._path || item.image?.path,
        publishDate: item.publishDate,
      })) || [];

    return new Response(JSON.stringify({ items }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 's-maxage=300', // edge cache 5 min
      },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500 }
    );
  }
}
