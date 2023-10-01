import "./App.css";
import Modal from "./components/Modal";
import { useState, useEffect } from "react";

function App() {
    const books = [
        { title: "Book 1", author: "Author 1", topic: "Topic 1" },
        { title: "Book 2", author: "Author 2", topic: "Topic 2" },
        { title: "Book 3", author: "Author 3", topic: "Topic 3" },
        { title: "Book 4", author: "Author 3", topic: "Topic 3" },
        { title: "Book 5", author: "Author 3", topic: "Topic 3" },
        { title: "Book 6", author: "Author 3", topic: "Topic 3" },
        { title: "Book 7", author: "Author 3", topic: "Topic 3" },
        { title: "Book 8", author: "Author 3", topic: "Topic 3" },
        { title: "Book 9", author: "Author 3", topic: "Topic 3" },
    ];

    const defaultForm = {
        title: "",
        author: "",
        topic: "Programing",
    };

    const [modalCreate, setModalCreate] = useState(false);
    const [modalDelete, setModalDelete] = useState({ open: false, data: "" });
    const [search, setSearch] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [formCreate, setFormCreate] = useState(defaultForm);
    const [data, setData] = useState([]);

    const pageSize = 5;

    const dataFilter = search
        ? data.filter(book => String(book.title).toLowerCase().startsWith(search.toLowerCase()))
        : data;

    const totalPage = Math.ceil(dataFilter?.length / pageSize);

    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const dataRender = dataFilter.slice(startIndex, endIndex);

    useEffect(() => {
        const lsBook = JSON.parse(localStorage.getItem("books"));
        if (lsBook && Array.isArray) {
            setData(lsBook);
        } else {
            localStorage.setItem("books", JSON.stringify(books));
        }
    }, []);

    const handleOpenModalCreate = () => {
        setModalCreate(true);
    };

    const handleOpenModalDelete = title => {
        setModalDelete({ open: true, data: title });
    };

    const onCloseModal = type => {
        type === "create" ? setModalCreate(false) : setModalDelete(prevState => ({ ...prevState, open: false }));
    };

    const handleSubmit = event => {
        event.preventDefault();
        let lsBooks = data;
        lsBooks.push({ title: formCreate.title, author: formCreate.author, topic: formCreate.topic });
        console.log("lsBooks", lsBooks);
        setData(lsBooks);
        localStorage.setItem("books", JSON.stringify(lsBooks));
        onCloseModal("create");
        setFormCreate(defaultForm);
    };

    const onDelete = title => {
        let lsBooks = data;
        const newBooks = lsBooks.filter(lsBook => lsBook["title"] !== title);
        localStorage.setItem("books", JSON.stringify(newBooks));
        setData(newBooks);
        onCloseModal("delete");
        setCurrentPage(1);
    };

    return (
        <>
            <div className="bookstore-cms-header">
                <div class="bookstore-cms-header-container">
                    <img src={require('./assets/df-logo.png')} alt="user avatar" />
                    <h1 className="app-name">Bookstore</h1>
                    <div className="profile">
                        <img
                            className="avatar"
                            src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_640.png"
                            alt="user avatar"
                        />
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
                <button class="dwarf-button" onClick={handleOpenModalCreate}>
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
                    {dataRender.map((data, index) => {
                        return (
                            <tr key={index}>
                                <td>{data.title}</td>
                                <td>{data.author}</td>
                                <td>{data.topic}</td>
                                <td>
                                    <button className="dwarf-button" onClick={() => handleOpenModalDelete(data.title)}>
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
            <div className={"paging"}>
                {Array(totalPage)
                    .fill(0)
                    .map((_, idx) => {
                        const page = idx + 1;
                        return (
                            <button
                                className={`page ${page === currentPage ? "active-page" : ""}`}
                                onClick={() => setCurrentPage(page)}
                            >
                                {page}
                            </button>
                        );
                    })}
            </div>
            <Modal open={modalCreate} title={"Create Books"} onClose={() => onCloseModal("create")}>
                <form onSubmit={handleSubmit}>
                    <label for="modalTitle">Title:</label>
                    <input
                        type="text"
                        placeholder="Enter title..."
                        onChange={e => setFormCreate(prevState => ({ ...prevState, title: e.target.value }))}
                    />
                    <label for="modalAuthor">Author:</label>
                    <input
                        type="text"
                        id="modalAuthor"
                        placeholder="Enter author..."
                        onChange={e => setFormCreate(prevState => ({ ...prevState, author: e.target.value }))}
                    />
                    <label for="modalTopic">Topic:</label>
                    <select
                        id="modalTopic"
                        onChange={e => setFormCreate(prevState => ({ ...prevState, topic: e.target.value }))}
                    >
                        <option value="Programming" selected="selected">
                            Programming
                        </option>
                        <option value="Database">Database</option>
                        <option value="DevOps">DevOps</option>
                    </select>
                    <button type="submit">Create</button>
                </form>
            </Modal>
            <Modal open={modalDelete.open} title={"Delete book"} onClose={() => onCloseModal("delete")}>
                <div>
                    <h1>{`Do you want to delete ${modalDelete.data}`}</h1>
                    <button class="dwarf-button" onClick={() => onCloseModal()}>
                        Cancel
                    </button>
                    <button class="normal-button" onClick={() => onDelete(modalDelete.data)}>Delete</button>
                </div>
            </Modal>
        </>
    );
}

export default App;
