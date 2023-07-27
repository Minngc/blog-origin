"use client";

import article from "@/config/articles.json";
import { MDXRemote } from "next-mdx-remote";
import Link from "next/link";
import useSWR from "swr";

type ArticlePath = [year: string, month: string, title: string];

const Heard2 = (props: any) => {
  return <h2 id={props.id}>{props.children}</h2>;
};

const Code = (props: any) => {
  return (
    <code
      style={{ display: "inline-block", width: "100%", overflowY: "scroll" }}
    >
      {props.children}
    </code>
  );
};
const Anchor = (props: any) => {
  if ((props.href as string).startsWith("#"))
    return (
      <Link href={props.href} replace>
        {props.children}
      </Link>
    );
  return <Link href={props.href}>{props.children}</Link>;
};

function getMd(path: string) {
  const data = fetch(`http://localhost:3000/api/article/${path}`).then(
    (res) => {
      return res.json();
    }
  );
  return data;
}

const Article = (props: { params: { slug: ArticlePath } }) => {
  const { params } = props;
  const { data } = useSWR(params.slug[2], getMd, {
    suspense: true,
  });
  return (
    <>
      <MDXRemote
        {...data.content}
        components={{ h2: Heard2, a: Anchor, code: Code }}
      />
    </>
  );
};

export default Article;

export async function generateStaticParams() {
  return article.map(({ year, month, data }) => {
    return { slug: [year, month, data.link] };
  });
}
