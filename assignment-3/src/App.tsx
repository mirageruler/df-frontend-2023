import "./App.css";
import { useState, useEffect, useRef } from "react";
import Modal from "./components/Modal";
import { IBook, IBooks } from "./interfaces/book";
import { books, defaultForm, pageSize } from "./constant";
import { createUniqueId } from "./util";

const logo = require("./assets/logo.png");

function App() {
    const [modalCreate, setModalCreate] = useState(false);
    const [modalDelete, setModalDelete] = useState({ open: false, title: "", id: "" });
    const [search, setSearch] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [data, setData] = useState<IBooks>([]);
    const [dataRender, setDataRender] = useState<IBooks>([]);

    const formData = useRef(defaultForm);

    const dataFilter = search ? data.filter((book: IBook) => String(book.title).toLowerCase().startsWith(search.toLowerCase())) : data;

    const totalPage = Math.ceil((dataFilter?.length || 0) / pageSize);

    useEffect(() => {
        const lsBook = JSON.parse(localStorage.getItem("books") || "{}");
        if (lsBook && Array.isArray(lsBook)) {
            setData(lsBook);
        } else {
            localStorage.setItem("books", JSON.stringify(books));
        }
    }, []);

    useEffect(() => {
        const dataFilter = search ? data.filter((book: IBook) => String(book.title).toLowerCase().startsWith(search.toLowerCase())) : data;
        const startIndex = (currentPage - 1) * pageSize;
        const endIndex = startIndex + pageSize;
        const dt = dataFilter.slice(startIndex, endIndex);
        setDataRender(dt);
    }, [currentPage, data, search]);

    const handleOpenModalCreate = () => {
        setModalCreate(true);
    };

    const handleOpenModalDelete = (title, id) => {
        setModalDelete({ open: true, title, id });
    };


    const onCloseModalCreate = () => {
      setModalCreate(false)
    }

    const onCloseModalDelete = () => {
      setModalDelete(prevState => ({ ...prevState, open: false }))
    }

    const handleSubmit = event => {
        event.preventDefault();
        const lsBooks: IBooks = [...data];
        lsBooks.push({
            title: formData.current.title,
            author: formData.current.author,
            topic: formData.current.topic,
            id: createUniqueId(),
        });
        setData(lsBooks);
        localStorage.setItem("books", JSON.stringify(lsBooks));
        onCloseModalCreate();
        formData.current = defaultForm;
    };

    const onDelete = id => {
        const lsBooks = data;
        const newBooks = lsBooks.filter(lsBook => lsBook["id"] !== id);
        localStorage.setItem("books", JSON.stringify(newBooks));
        setData(newBooks);
        onCloseModalDelete()
        setCurrentPage(1);
    };

    return (
        <>
            <div className="bookstore-cms-header">
                <div className="bookstore-cms-header-container">
                    <img src={logo} alt="user avatar" />
                    <h1 className="app-name">Bookstore</h1>
                    <div className="profile">
                        <img className="avatar" src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_640.png" alt="user avatar" />
                        <div className="profile-name">John Doe</div>
                    </div>
                </div>
                <hr />
            </div>

            <div className="search">
                <input
                    type="text"
                    className="search-input"
                    placeholder="Enter title to search books (case insensitive)"
                    value={search}
                    onChange={e => {
                        setCurrentPage(1);
                        setSearch(e.target.value);
                    }}
                />
                <button className="dwarf-button" onClick={handleOpenModalCreate}>
                    Add Book
                </button>
            </div>
            <table className="table">
                <thead>
                    <tr>
                        <th>Title</th>
                        <th>Author</th>
                        <th>Topic</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {dataRender.map((data: IBook, index) => {
                        return (
                            <tr key={index}>
                                <td>{data.title}</td>
                                <td>{data.author}</td>
                                <td>{data.topic}</td>
                                <td>
                                    <button className="dwarf-button" onClick={() => handleOpenModalDelete(data.title, data.id)}>
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
            <div className="paging">
                {Array(totalPage)
                    .fill(0)
                    .map((_, idx) => {
                        const page = idx + 1;
                        return (
                            <button key={page} className={`page ${page === currentPage ? "active-page" : ""}`} onClick={() => setCurrentPage(page)}>
                                {page}
                            </button>
                        );
                    })}
            </div>
            <Modal open={modalCreate} title="Create Books" onClose={onCloseModalCreate}>
                <form onSubmit={handleSubmit}>
                    <p>Title:</p>
                    <input type="text" placeholder="Enter title..." onChange={e => {formData.current = {...formData.current, title: e.target.value}}} />
                    <p>Author:</p>
                    <input
                        type="text"
                        id="modalAuthor"
                        placeholder="Enter author..."
                        onChange={e => {formData.current = {...formData.current, author: e.target.value}}}
                    />
                    <p>Topic:</p>
                    <select id="modalTopic" onChange={e => {formData.current = {...formData.current, topic: e.target.value}}}>
                        <option value="Programming">Programming</option>
                        <option value="Database">Database</option>
                        <option value="DevOps">DevOps</option>
                    </select>
                    <button type="submit">Create</button>
                </form>
            </Modal>
            <Modal open={modalDelete.open} title="Delete book" onClose={onCloseModalDelete}>
                <div>
                    <h1>{`Do you want to delete ${modalDelete.title}`}</h1>
                    <button className="dwarf-button" onClick={onCloseModalDelete}>
                        Cancel
                    </button>
                    <button className="normal-button" onClick={() => onDelete(modalDelete.id)}>
                        Delete
                    </button>
                </div>
            </Modal>
        </>
    );
}

export default App; 
