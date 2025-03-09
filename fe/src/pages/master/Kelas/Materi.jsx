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

const ModalInputUrl = ({ showModalInputUrl, onClose, onSave }) => {
    const inputRef = useRef(null);

    const handleSaveLink = () => {
        const url = inputRef.current.value.trim();
        if (url) {
            console.log("ini jalannnnn");
            onSave(url);
            onClose();
        }
    };

    if (!showModalInputUrl) return null;

    return (
        <div className="d-flex justify-content-center align-items-center position-fixed top-0 start-0 w-100 h-100 bg-dark bg-opacity-50" style={{ zIndex: 11 }}>
            <div className="shadow-sm card p-3" style={{ width: "300px", height: "180px", borderRadius: "10px", backgroundColor: "white" }}>
                <h6 className="text-center mb-2">Masukkan URL</h6>

                <input
                    type="url"
                    className="form-control border-danger mb-3"
                    placeholder="https://example.com"
                    ref={inputRef}
                />

                <div className="d-flex justify-content-center gap-2">
                    <button className="btn btn-secondary btn-sm px-4 rounded-pill" onClick={onClose}>Cancel</button>
                    <button className="btn btn-danger btn-sm px-4 rounded-pill" onClick={handleSaveLink}>Add</button>
                </div>
            </div>
        </div>
    );
};
ModalInputUrl.propTypes = {
    showModalInputUrl: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onSave: PropTypes.func.isRequired,
};


const SortableItem = ({ item, materi, setMateri }) => {
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: item.id });
    const style = { transform: CSS.Transform.toString(transform), transition };
    const [attachments, setAttachments] = useState({});
    const [currentSubMateri, setCurrentSubMateri] = useState(null);
    const [showModalInputUrl, setShowModalInputUrl] = useState(false);
    const [, setInputLink] = useState("");


    const handleChangeNameMateri = (id, value) => {
        const updatedMateri = [...materi];
        for (let i = 0; i < updatedMateri.length; i++) {
            if (updatedMateri[i].id === id) {
                updatedMateri[i] = { ...updatedMateri[i], name: value };
                break;
            }
        }
        setMateri(updatedMateri);
    };
    const startEditingNameMateri = (id) => {
        const updatedMateri = [...materi];
        for (let i = 0; i < updatedMateri.length; i++) {
            if (updatedMateri[i].id === id) {
                updatedMateri[i] = { ...updatedMateri[i], isEditing: true };
                break;
            }
        }
        setMateri(updatedMateri);
        // setMateri(materi.map(item => item.id === id ? { ...item, isEditing: true } : item));
    };
    const stopEditingNameMateri = (id, value) => {
        const updatedMateri = [...materi];
        for (let i = 0; i < updatedMateri.length; i++) {
            if (updatedMateri[i].id === id) {
                updatedMateri[i] = { ...updatedMateri[i], isEditing: false, name: value };
                break;
            }
        }
        setMateri(updatedMateri);
        // setMateri(materi.map(item => item.id === id ? { ...item, isEditing: false, name: value } : item));
    };
    const toggleSubMateri = (id) => {
        const updatedMateri = [...materi];
        for (let i = 0; i < updatedMateri.length; i++) {
            if (updatedMateri[i].id === id) {
                updatedMateri[i] = { ...updatedMateri[i], showSub: !updatedMateri[i].showSub };
                break;
            }
        }
        setMateri(updatedMateri);
        // setMateri(materi.map(item =>
        //     item.id === id ? { ...item, showSub: !item.showSub } : item
        // ));
    };
    const handleAddSubMateri = (id) => {
        setMateri(materi.map(item =>
            item.id === id
                ? { ...item, subcategories: [...item.subcategories, { id: item.subcategories.length + 1, name: ' ', isEditing: true }] }
                : item
        ));
    };
    const toggleSubMateriAndhandleAddSubMateri = (id) => {
        setMateri(materi.map(item =>
            item.id === id
                ? { ...item, subcategories: [...item.subcategories, { sub_Materi_id: item.subcategories.length + 1, name: ' ', showSub: true }] }
                : item
        ));
    };




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
        <div className="border border-danger p-2 mb-3 rounded" ref={setNodeRef} style={style}>
            <div className="d-flex justify-content-between align-items-center">

                <div {...attributes} {...listeners} className="d-flex align-items-center" style={{ width: '30px', cursor: 'grab' }}>
                    <img
                        src={subkategori}
                        alt="Toggle Subcategories"
                        width="13px"
                        height="13px"
                        className="me-2 icon-white"
                        style={{ cursor: 'pointer' }}
                    />
                </div>

                <div className="d-flex align-items-center" style={{ width: '100%' }}>
                    {
                        item.isEditing ?
                            (
                                <input
                                    type="text"
                                    value={item.name}
                                    onChange={(e) => handleChangeNameMateri(item.id, e.target.value)}
                                    onBlur={(e) => stopEditingNameMateri(item.id, e.target.value)}
                                    onKeyDown={(e) => e.key === "Enter" && stopEditingNameMateri(item.id, e.target.value)}
                                    className="form-control edit-input"
                                    style={{ width: '400px', height: '40px' }}
                                    autoFocus
                                />
                            ) :
                            (
                                <span>{item.name}</span>
                            )
                    }
                </div>

                <div className="d-flex align-items-center gap-2">
                    {[
                        { src: item.showSub ? view : hide, action: () => toggleSubMateri(item.id) },
                        { src: edit_2, action: () => startEditingNameMateri(item.id) },
                        {
                            src: add_2,
                            action: () => {
                                if (item.showSub) {
                                    handleAddSubMateri(item.id);
                                } else {
                                    toggleSubMateriAndhandleAddSubMateri(item.id);
                                }



                            }
                        }
                    ].map((btn, index) => (
                        <div
                            key={index}
                            className="d-flex align-items-center justify-content-center"
                            style={{ cursor: 'pointer', width: '30px', height: '30px' }}
                            onClick={btn.action}
                        >
                            <img src={btn.src} alt="Button Icon" width="20" height="20" className="icon-white" />
                        </div>
                    ))}
                </div>


            </div>

            {item.showSub && item.subcategories.length > 0 && (
                <ul className="mt-2">
                    {item.subcategories.map(sub => (
                        <li
                            key={sub.sub_Materi_id}
                            className="border border-danger p-2 rounded mb-1 d-flex justify-content-between align-items-center"
                        >
                            <div className="d-flex w-100 align-items-center">

                                {!sub.isEditing ?
                                    (
                                        <div className=''
                                            onClick={() => startEditingNameSubMateri(sub.id, item.id)}
                                            style={{ marginLeft: "10px", minWidth: "100px", minHeight: "20px", display: "inline-block" }}
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


                                <div className="dropdown ms-auto">
                                    <button
                                        className="btn text dropdown-toggle"
                                        type="button"
                                        id={sub.id}
                                        data-bs-toggle="dropdown"
                                        aria-expanded="false"
                                        style={{ width: "80px", height: "35px", color: "black" }}
                                    >
                                        File
                                    </button>
                                    <ul className="dropdown-menu" aria-labelledby={sub.id}>
                                        <li>
                                            <button className="dropdown-item" onClick={() => handleAttachFile(sub.id, "file")}>
                                                📂 Upload File
                                            </button>
                                        </li>
                                        <li>
                                            <button className="dropdown-item" onClick={() => handleAttachFile(sub.id, "link")}>
                                                🔗 Tambah Link
                                            </button>
                                        </li>
                                    </ul>
                                </div>

                                {/* Preview File / Link */}
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


                                <ModalInputUrl showModalInputUrl={showModalInputUrl} onClose={() => setShowModalInputUrl(false)} onSave={handleSaveLink} />
                                <div
                                    className="d-flex align-items-center rounded px-2 py-1 text-secondary ms-2"
                                    style={{ cursor: "pointer", width: "40px", height: "35px", justifyContent: "center" }}
                                >
                                    <img
                                        onClick={() => handleDeleteSubMateri(item.id, sub.sub_Materi_id)}
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
            )}

        </div>
    );
};
SortableItem.propTypes = {
    item: PropTypes.shape({
        id: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        isEditing: PropTypes.bool,
        showSub: PropTypes.bool,
        subcategories: PropTypes.arrayOf(
            PropTypes.shape({
                id: PropTypes.string.isRequired,
                name: PropTypes.string.isRequired
            })
        )
    }).isRequired,
    setMateri: PropTypes.func.isRequired
};





const MateriForm = () => {
    const [materi, setMateri] = useState([]);

    useEffect(() => {
        console.log("🚀 ~ MateriForm ~ materi:", materi);
    }, [materi]); // Memantau perubahan materi

    const handleAddMateri = () => {
        const newId = (materi.length + 1).toString();
        const newOrder = materi.length + 1; 
        setMateri([...materi, { id: newId, name: '', isEditing: true, subcategories: [], showSub: false, order: newOrder }]);
    };

    const handleDragEnd = (event) => {
        const { active, over } = event;
        if (!over || active.id === over.id) return;

        const oldIndex = materi.findIndex(task => task.id === active.id);
        const newIndex = materi.findIndex(task => task.id === over.id);

        const updatedMateri = arrayMove(materi, oldIndex, newIndex).map((item, index) => ({
            ...item,
            order: index + 1, 
        }));

        setMateri(updatedMateri);
    };

    return (
        <div>
            <div>
                <label className="form-label fw-bold">Materi *</label>
            </div>
            <div>
                <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                    <SortableContext items={materi.map(item => item.id)} strategy={verticalListSortingStrategy}>
                        {materi
                            .sort((a, b) => a.order - b.order) // Pastikan urutan sesuai order
                            .map(item => <SortableItem key={item.id} item={item} materi={materi} setMateri={setMateri} />)}
                    </SortableContext>
                </DndContext>
            </div>
            <button className="border border-danger btn btn-danger btn-sm rounded ms-auto" onClick={handleAddMateri}>Add</button>
        </div>
    );
};
export default MateriForm;
