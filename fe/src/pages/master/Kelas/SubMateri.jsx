/* eslint-disable react/prop-types */
import { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { DndContext, closestCenter } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy, arrayMove, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import subkategori from '../../../assets/subkategori.png';
import view from '../../../assets/view.png';
import hide from '../../../assets/hide.png';
import add_2 from '../../../assets/add.png';
import edit_2 from '../../../assets/pencil.png';
import deleteitem from '../../../assets/deleteitem.png';
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

/** Reusable Modal Component */
const Modal = ({ show, title, onClose, onSave, children }) => {
    if (!show) return null;

    return (
        <div className="d-flex justify-content-center align-items-center position-fixed top-0 start-0 w-100 h-100 bg-dark bg-opacity-50" style={{ zIndex: 11 }}>
            <div className="shadow-sm card p-3" style={{ width: "auto", borderRadius: "10px", backgroundColor: "white", zIndex: 20 }}>
                <h6 className="text-center mb-2">{title}</h6>
                {children}
                <div className="d-flex justify-content-center gap-2 mt-2">
                    <button className="btn btn-secondary btn-sm px-4 rounded-pill" onClick={onClose}>Cancel</button>
                    <button className="btn btn-danger btn-sm px-4 rounded-pill" onClick={onSave}>Add</button>
                </div>
            </div>
        </div>
    );
};

Modal.propTypes = {
    show: PropTypes.bool.isRequired,
    title: PropTypes.string.isRequired,
    onClose: PropTypes.func.isRequired,
    onSave: PropTypes.func.isRequired,
    children: PropTypes.node.isRequired,
};
const ModalInputUrl = ({ showModal, onClose, onSave }) => {
    const inputRef = useRef(null);

    return (
        <Modal show={showModal} title="Masukkan URL" onClose={onClose} onSave={() => {
            const url = inputRef.current?.value.trim();
            if (url) onSave(url);
        }}>
            <input type="url" className="form-control border-danger mb-3" placeholder="https://example.com" ref={inputRef} />
        </Modal>
    );
};

ModalInputUrl.propTypes = {
    showModal: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onSave: PropTypes.func.isRequired,
};

const ModalInputText = ({ showModal, onClose, onSave }) => {
    const [content, setContent] = useState("");

    return (
        <Modal show={showModal} title="Masukkan Teks" onClose={onClose} onSave={() => onSave(content)}>
            <ReactQuill theme="snow" value={content} onChange={setContent} />
        </Modal>
    );
};

ModalInputText.propTypes = {
    showModal: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onSave: PropTypes.func.isRequired,
};


export const SubMateri = () => {
    const [attachments, setAttachments] = useState({});
    const [currentSubMateri, setCurrentSubMateri] = useState(null);
    const [showModalInputUrl, setShowModalInputUrl] = useState(false);
    const [showModalInputText, setShowModalInputText] = useState(false);
    const [, setInputLink] = useState("");
    const startEditingNameSubMateri = (id, idParent) => {
        const updatedMateri = [...materi];
        for (let i = 0; i < updatedMateri.length; i++) {
            if (updatedMateri[i].id === idParent) {
                for (let j = 0; j < updatedMateri[i].subcategories.length; j++) {
                    if (updatedMateri[i].subcategories[j].id === id) {
                        updatedMateri[i].subcategories[j] = { ...updatedMateri[i].subcategories[j], isEditing: true };
                        break;
                    }
                }
            }
        }
        setMateri(updatedMateri);
        // setMateri(materi.map(item => item.id === id ? { ...item, isEditing: true } : item));
    };
    const handleChangeNameSubMateri = (id, idParent, value) => {
        const updatedMateri = [...materi];
        for (let i = 0; i < updatedMateri.length; i++) {
            if (updatedMateri[i].id === idParent) {
                for (let j = 0; j < updatedMateri[i].subcategories.length; j++) {
                    if (updatedMateri[i].subcategories[j].id === id) {
                        updatedMateri[i].subcategories[j] = { ...updatedMateri[i].subcategories[j], name: value };
                        break;
                    }
                }
            }
        }
        setMateri(updatedMateri);
    };
    const handleSaveSubMateri = (id, idParent, value) => {
        const updatedMateri = [...materi];
        for (let i = 0; i < updatedMateri.length; i++) {
            if (updatedMateri[i].id === idParent) {
                for (let j = 0; j < updatedMateri[i].subcategories.length; j++) {
                    if (updatedMateri[i].subcategories[j].id === id) {
                        updatedMateri[i].subcategories[j] = { ...updatedMateri[i].subcategories[j], name: value, isEditing: false };
                        break;
                    }
                }
            }
        }
        setMateri(updatedMateri);
    };
    const handleDeleteSubMateri = (id, idParent) => {
        console.log("🚀 ~ handleDeleteSubMateri ~ idParent:", idParent)
        console.log("🚀 ~ handleDeleteSubMateri ~ id:", id)
        const newMateri = [];
        for (let i = 0; i < materi.length; i++) {
            if (materi[i].id === idParent) {
                const newSubcategories = [];
                for (let j = 0; j < materi[i].subcategories.length; j++) {
                    if (materi[i].subcategories[j].id !== id) {
                        newSubcategories.push(materi[i].subcategories[j]);
                    }
                }
                newMateri.push({ ...materi[i], subcategories: newSubcategories });
            } else {
                newMateri.push(materi[i]);
            }
        }

        setMateri(newMateri);
    };
    const handleAttachFile = (subMateriId, type) => {
        if (type === "file") {
            const input = document.createElement("input");
            input.type = "file";
            input.accept = "image/*,application/pdf";
            input.onchange = (event) => {
                const file = event.target.files[0];
                if (file) {
                    setAttachments((prev) => ({
                        ...prev,
                        [subMateriId]: { type: "file", name: file.name, url: URL.createObjectURL(file) },
                    }));
                }
            };
            input.click();
        } else if (type === "link") {
            setCurrentSubMateri(subMateriId);
            setShowModalInputUrl(true);
        }
        else if (type === "text") {
            setCurrentSubMateri(subMateriId);
            setShowModalInputText(true);
        }
    };
    const handleSaveLink = (url) => {
        console.log(url)

        if (url.trim()) {
            setAttachments((prev) => ({
                ...prev,
                [currentSubMateri]: { type: "link", url: url },
            }));
            setShowModalInputUrl(false);
            setInputLink("");
        }
    };
    return (
        <ul className="mt-2">
            {item.subcategories.map((sub, index) => (
                <li key={(index)} className="border border-danger p-2 rounded mb-1 d-flex justify-content-between align-items-center" >
                    <div className="d-flex w-100  align-items-center">
                        {!sub.isEditing ?
                            (
                                <div className=''
                                    onClick={() => startEditingNameSubMateri(sub.id, item.id)}
                                    style={{ marginLeft: "10px", marginRight: "150px", minWidth: "150px", minHeight: "20px", display: "inline-block" }}
                                >
                                    {sub.name}
                                </div>

                            ) :
                            (
                                <input
                                    type="text"
                                    value={sub.name}
                                    placeholder="Tambahkan Nama Materi"
                                    className="form-control texty"
                                    style={{ flexGrow: 1, minWidth: "150px", maxWidth: "350px", color: "black" }}
                                    onChange={(e) => {
                                        handleChangeNameSubMateri(sub.id, item.id, e.target.value)
                                    }}
                                    onBlur={(e) => handleSaveSubMateri(sub.id, item.id, e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter") {
                                            e.preventDefault();
                                            handleSaveSubMateri(sub.id, item.id, e.target.value);
                                        }
                                    }}
                                />
                            )
                        }
                        {<div className="dropdown ms-auto">
                            <button
                                className="btn text dropdown-toggle"
                                type="button"
                                id={sub.id}
                                data-bs-toggle="dropdown"
                                aria-expanded="false"
                                style={{ width: "80px", height: "35px", color: "black" }}
                            >
                                isi
                            </button>
                            <ul className="dropdown-menu" aria-labelledby={sub.id}>
                                <li>
                                    <button className="dropdown-item" onClick={() => handleAttachFile(sub.id, "text")}>
                                        Text
                                    </button>
                                </li>
                                <li>
                                    <button className="dropdown-item" onClick={() => handleAttachFile(sub.id, "link")}>
                                        Link
                                    </button>
                                </li>
                            </ul>
                        </div>}
                        {attachments[sub.id] && (
                            <div
                                className="ms-2"
                                style={{
                                    width: "150px",
                                    minHeight: "40px",
                                    padding: "5px",
                                    border: "1px solid #dc3545",
                                    borderRadius: "5px",
                                    backgroundColor: "#f8d7da",
                                    textAlign: "center",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    whiteSpace: "nowrap",
                                    overflow: "hidden",
                                    textOverflow: "ellipsis"
                                }}
                            >
                                {attachments[sub.id].type === "file" ? (
                                    <a
                                        href={attachments[sub.id].url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        style={{ textDecoration: "none", color: "#dc3545" }}
                                    >
                                        📄 {attachments[sub.id].name}
                                    </a>
                                ) : (
                                    <a
                                        href={attachments[sub.id].url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        style={{ textDecoration: "none", color: "#dc3545" }}
                                    >
                                        🔗 Link
                                    </a>
                                )}
                            </div>
                        )}
                        <ModalInputUrl showModal={showModalInputUrl} onClose={() => setShowModalInputUrl(false)} onSave={handleSaveLink} />
                        <ModalInputText showModal={showModalInputText} onClose={() => setShowModalInputText(false)} onSave={handleSaveLink} />
                        <div className="d-flex align-items-center rounded px-2 py-1 text-secondary ms-2" style={{ cursor: "pointer", width: "40px", height: "35px", justifyContent: "center" }} >
                            <img
                                onClick={() => handleDeleteSubMateri(sub.id, item.id)}
                                src={deleteitem}
                                alt="Hapus Materi"
                                width="20"
                                height="20"
                                className="icon-white"
                            />
                        </div>
                    </div>
                </li>
            ))}
        </ul>
    )
}