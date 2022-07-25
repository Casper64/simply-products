import React, { ReactNode, useEffect, useRef, useState } from 'react'
import Home from '@/pages/dashboard'
import { Page } from 'types'
import { useRouter } from 'next/router'
import store from '@/store'
import Project from '@/components/ui/Project'
import axios from 'axios'
import { useUser, withPageAuthRequired } from '@auth0/nextjs-auth0'
import { Category } from '~/models/Category'
import { observer } from 'mobx-react'
import DangerZone from '@/components/DangerZone'

const helpFileCode = `# h1 Heading
## h2 Heading
### h3 Heading
#### h4 Heading
##### h5 Heading
###### h6 Heading


## Horizontal Rules

___

---

***


## Typographic replacements

Enable typographer option to see result.

(c) (C) (r) (R) (tm) (TM) (p) (P) +-

test.. test... test..... test?..... test!....

!!!!!! ???? ,,  -- ---

"Smartypants, double quotes" and 'single quotes'


## Emphasis

**This is bold text**

__This is bold text__

*This is italic text*

_This is italic text_

~~Strikethrough~~


## Blockquotes


> Blockquotes can also be nested...
>> ...by using additional greater-than signs right next to each other...
> > > ...or with spaces between arrows.


## Lists

Unordered

+ Create a list by starting a line with \`+\`, \`-\`, or \`*\`
+ Sub-lists are made by indenting 2 spaces:
  - Marker character change forces new list start:
    * Ac tristique libero volutpat at
    + Facilisis in pretium nisl aliquet
    - Nulla volutpat aliquam velit
+ Very easy!

Ordered

1. Lorem ipsum dolor sit amet
2. Consectetur adipiscing elit
3. Integer molestie lorem at massa


1. You can use sequential numbers...
1. ...or keep all the numbers as \`1.\`

Start numbering with offset:

57. foo
1. bar


## Code

Inline \`code\`

Indented code

    // Some comments
    line 1 of code
    line 2 of code
    line 3 of code


Block code "fences"

\`\`\`
Sample text here...
\`\`\`

Syntax highlighting

\`\`\` js
var foo = function (bar) {
  return bar++;
};

console.log(foo(5));
\`\`\`

## Math

You can use latex syntax to get math displayed

\`\`\`math
\begin{align}
\int_0^{1} 10x^2+4x\:dx &= \left[3\frac{1}{3}x^3+2x^2\right]_0^{1} 
 \\
&= 3\frac{1}{3}+2 \\
&= 5\frac{1}{3}

\end{align}
\`\`\`

## Tables

| Option | Description |
| ------ | ----------- |
| data   | path to data files to supply the data that will be passed into templates. |
| engine | engine to be used for processing templates. Handlebars is the default. |
| ext    | extension to be used for dest files. |

Right aligned columns

| Option | Description |
| ------:| -----------:|
| data   | path to data files to supply the data that will be passed into templates. |
| engine | engine to be used for processing templates. Handlebars is the default. |
| ext    | extension to be used for dest files. |


## Links

[link text](http://dev.nodeca.com)

[link with title](http://nodeca.github.io/pica/demo/ "title text!")

Autoconverted link https://github.com/nodeca/pica (enable linkify to see)


## Images

![Minion](https://octodex.github.com/images/minion.png)
![Stormtroopocat](https://octodex.github.com/images/stormtroopocat.jpg "The Stormtroopocat")

Like links, Images also have a footnote style syntax

![Alt text][id]

With a reference later in the document defining the URL location:

[id]: https://octodex.github.com/images/dojocat.jpg  "The Dojocat"




`

const CategoryPage: Page = observer(() => {
    const categories = store.databaseStore.categories.models;
    const projects = store.databaseStore.projects.models;
    // const [projects, setProjects] = useState(store.databaseStore.projects.models);

    const router = useRouter();
    const [id, setId] = useState(router.query.id);
    const [add, setAdd] = useState(false);
    const { user } = useUser();
    const inputEl = useRef(null as HTMLInputElement | null);
    

    const getProjects = () => {
        if (!id) return []
        return projects.filter(p => p.category == id)
    }

    const getCategory = () => {
        if (!id) return undefined
        return categories.find(c => c._id === (id as string))
    }

    const handleEscape
        : React.KeyboardEventHandler<HTMLInputElement> = async (event) => {
            if (event.key === "Escape") {
                setAdd(false);
            }
            else if (event.key === "Enter" && inputEl.current?.value.trim().length != 0) {
                const { data } = await axios.post('/api/projects', {
                    name: inputEl.current?.value,
                    public: false,
                    category: id as string,
                    owner: user?.sub
                })
                const project = data.data;
                store.databaseStore.projects.addModel(project);
                // Create the defult help file
                await axios.post('/api/documents', {
                    name: "help",
                    folder: false,
                    parent: project._id,
                    project: project._id,
                    code: helpFileCode,
                    owner: user?.sub
                });

                setAdd(false);
            }
    }

    const deleteCategory = async () => {
        const { data } = await axios.delete(`/api/categories/${getCategory()?._id}`)
        if (data.success) {
            router.push('/dashboard')
        }
    }

    const renameCategory = async (name: string) => {
        let cat = {
            ...getCategory(),
            name
        } as Category
        await axios.put(`/api/categories/${getCategory()?._id}`, cat);
        store.databaseStore.categories.updateModel(cat)
    }

    useEffect(() => {
        setId(router.query.id)
        if (!id) {
            router.push('/dashboard');
        }
    }, [router, id])

    useEffect(() => {
        if (add) {
            inputEl.current?.focus();
        }
    }, [add])

    return (
        <div className="settings-display">
            <p className="title">Dashboard { getCategory()?.name }</p>
            <div className="card projects-list">
                <div className="header">
                    <p>Projects</p>
                </div>
                <div className="projects-list-container">
                    { getProjects().map(project => {
                        return <Project key={project._id} project={project}/>
                    })}
                    { add && <div className="project new">
                        <input 
                            type="text" 
                            ref={inputEl}
                            onBlur={() => setAdd(false)}
                            onKeyUp={handleEscape}/>
                    </div> }
                    <div className="project add" onClick={() => setAdd(true)}>
                        <p>Add project</p>
                    </div>
                </div>
            </div>
            <DangerZone 
                model={getCategory()}
                delete={deleteCategory}
                rename={renameCategory} 
            />
        </div>
    )
})

export const getServerSideProps = withPageAuthRequired({
    returnTo: '/dashboard'
})


// TODO: STORE PROJECTS AND CATEGORIES IN STORE!!!

CategoryPage.getLayout = (page: ReactNode) => {
    return (
        <Home>
            {page}
        </Home>
    )
}


export default CategoryPage