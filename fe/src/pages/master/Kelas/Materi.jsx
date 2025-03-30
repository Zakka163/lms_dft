/* eslint-disable react/prop-types */
import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { DndContext, closestCenter } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy, arrayMove, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import subkategori from '../../../assets/subkategori.png';
import view from '../../../assets/view.png';
import hide from '../../../assets/hide.png';
import add_2 from '../../../assets/add.png';
import edit_2 from '../../../assets/pencil.png';
import "react-quill/dist/quill.snow.css";
// import { SubMateri } from './SubMateri';



const SortableItem = ({ isEditing, item, materi, setMateri }) => {
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: item.id });

    const disabledStyle = {
        backgroundColor: "#e9ecef",
        color: "#6c757d",
        cursor: "not-allowed",
        opacity: 0.65,
        pointerEvents: "none",
        transform: CSS.Transform.toString(transform),
        transition
    };
    const style = {
        transform: CSS.Transform.toString(transform),
        transition
    };



    const handleChangeNameMateri = (id, value) => {
        setMateri(prev => {
            const updatedMateri = prev?.materi?.map(item =>
                item.id === id ? { ...item, name: value } : item
            ) ?? [];

            return { ...prev, materi: updatedMateri };
        });
    };

    const startEditingNameMateri = (id) => {
        setMateri(prev => {
            const updatedMateri = prev?.materi?.map(item =>
                item.id === id ? { ...item, isEditing: true } : item
            ) ?? [];

            return { ...prev, materi: updatedMateri };
        });
    };

    const stopEditingNameMateri = (id, value) => {
        setMateri(prev => {
            const updatedMateri = prev?.materi?.map(item =>
                item.id === id ? { ...item, isEditing: false, name: value } : item
            ) ?? [];

            return { ...prev, materi: updatedMateri };
        });
    };

    const toggleSubMateri = (id) => {
        setMateri(prev => {
            const updatedMateri = prev?.materi?.map(item =>
                item.id === id ? { ...item, showSub: !item.showSub } : item
            ) ?? [];

            return { ...prev, materi: updatedMateri };
        });
    };

    const handleAddSubMateri = (id) => {
        setMateri(prev => {
            const updatedMateri = prev?.materi?.map(item =>
                item.id === id
                    ? {
                        ...item,
                        subcategories: [...item.subcategories, { id: item.subcategories.length + 1, name: ' ', isEditing: true }]
                    }
                    : item
            ) ?? [];

            return { ...prev, materi: updatedMateri };
        });
    };

    const toggleSubMateriAndhandleAddSubMateri = (id) => {
        setMateri(prev => {
            const updatedMateri = prev?.materi?.map(item =>
                item.id === id
                    ? {
                        ...item,
                        showSub: true,
                        subcategories: [...item.subcategories, { sub_Materi_id: item.subcategories.length + 1, name: ' ' }]
                    }
                    : item
            ) ?? [];

            return { ...prev, materi: updatedMateri };
        });
    };


    return (
        <div
            className="border border-danger p-2 mb-3 rounded"
            ref={setNodeRef}
            style={isEditing ? style : { ...style, ...disabledStyle }}
        >
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
                                <span style={{ color: "black" }}>{item.name}</span>
                            )
                    }
                </div>

                <div className="d-flex align-items-center gap-2" style={{ minHeight: "30px" }}>
                    {isEditing &&
                        [
                            { src: item.showSub ? view : hide, action: () => toggleSubMateri(item.id) },
                            { src: edit_2, action: () => startEditingNameMateri(item.id) },
                            {
                                src: add_2,
                                action: () => {
                                    toggleSubMateri(item.id);
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
                        ))
                    }
                </div>


            </div>
            {/* {item.showSub && item.subcategories.length > 0 && (
                <SubMateri />
            )} */}

        </div >
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
                id: PropTypes.number.isRequired,
                name: PropTypes.string.isRequired,
                isValue: PropTypes.bool,
                isValtypeue: PropTypes.string
            })
        )
    }).isRequired,
    setMateri: PropTypes.func.isRequired
};





const MateriForm = ({ formData, setFormData, isEditing }) => {
    const handleAddMateri = () => {
        const materiList = formData.materi || [];
        const newId = (materiList.length + 1).toString();
        const newOrder = materiList.length + 1;
        let data = { id: newId, name: '', isEditing: true, subcategories: [], showSub: false, order: newOrder }
        setFormData(prev => ({
            ...prev,
            materi: [...materiList, data]
        }));
    };

    const handleDragEnd = (event) => {
        const { active, over } = event;
        if (!over || active.id === over.id) return;
        const oldIndex = formData.materi.findIndex(task => task.id === active.id);
        const newIndex = formData.materi.findIndex(task => task.id === over.id);
        const updatedMateri = arrayMove(formData.materi, oldIndex, newIndex).map((item, index) => ({
            ...item,
            order: index + 1,
        }));
        setFormData(prev => ({ ...prev, materi: updatedMateri }));
    };

    return (
        <div>
            <div>
                <label className="form-label fw-bold">Materi *</label>
            </div>
            <div>
                <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                    <SortableContext items={(formData.materi || []).map(item => item.id)} strategy={verticalListSortingStrategy}>
                        {(formData.materi || [])
                            .sort((a, b) => a.order - b.order)
                            .map(item => (
                                <SortableItem isEditing={isEditing} key={item.id.toString()} item={item} materi={formData.materi || []} setMateri={setFormData} />
                            ))
                        }
                    </SortableContext>
                </DndContext>
            </div>
            {isEditing && <button className="border border-danger btn btn-danger btn-sm rounded ms-auto" onClick={handleAddMateri}>Add</button>}
        </div>
    );
};

export default MateriForm;
