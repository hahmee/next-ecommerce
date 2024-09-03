import React, {useRef} from "react";
import {useDrag, useDrop} from "react-dnd";
import {Identifier, XYCoord} from "dnd-core";

interface Props {
    image: string;
    editImage: (image: string) => void;
    deleteImage: (image: string) => void;
    handleMouseOver: (image: string) => void;
    handleMouseOut: (image: string) => void;
    hoveredImg: string;
    index: number;
    moveCard: (dragIndex:number, hoverIndex:number) => void
    id: number;

}

interface DragItem {
    index: number
    id: string
    type: string
}

export const ItemTypes = {
    IMAGE: 'image',
}

const ImagePreview = ({image, deleteImage, editImage, handleMouseOver, handleMouseOut, hoveredImg, index, moveCard, id}: Props) => {
    const ref = useRef<HTMLDivElement>(null);
    const [{ handlerId }, drop] = useDrop<DragItem, void, { handlerId: Identifier | null }>({
        accept: ItemTypes.IMAGE,
        collect(monitor) {
            return {
                handlerId: monitor.getHandlerId(),
            }
        },
        hover(item: DragItem, monitor) {
            console.log('???')
            if (!ref.current) {
                return
            }
            const dragIndex = item.index
            const hoverIndex = index

            // Don't replace items with themselves
            if (dragIndex === hoverIndex) {
                return
            }

            // Determine rectangle on screen
            const hoverBoundingRect = ref.current?.getBoundingClientRect()

            // Get vertical middle
            const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2

            // Determine mouse position
            const clientOffset = monitor.getClientOffset()

            // Get pixels to the top
            const hoverClientY = (clientOffset as XYCoord).y - hoverBoundingRect.top

            // Only perform the move when the mouse has crossed half of the items height
            // When dragging downwards, only move when the cursor is below 50%
            // When dragging upwards, only move when the cursor is above 50%

            // Dragging downwards
            if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
                return
            }

            // Dragging upwards
            if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
                return
            }

            // Time to actually perform the action
            moveCard(dragIndex, hoverIndex)

            // Note: we're mutating the monitor item here!
            // Generally it's better to avoid mutations,
            // but it's good here for the sake of performance
            // to avoid expensive index searches.
            item.index = hoverIndex
        },
    })
    const [{isDragging}, drag] = useDrag({
        type: ItemTypes.IMAGE,
        item: () => {
            return {id, index}
        },
        collect: (monitor: any) => ({
            isDragging: monitor.isDragging(),
        }),
    });

    const opacity = isDragging ? 0 : 1

    drag(drop(ref));

    const hoverActionComponent = () => {
        return (
            <div className="flex justify-end items-center w-48 gap-2 mt-2">
                <div onClick={() => editImage(image)}>
                    <img src={"/edit.svg"} alt="close" className="h-4 w-4"/>
                </div>
                <div className="mr-2" onClick={() => deleteImage(image)}>
                    <img src={"/close.svg"} alt="close" className="h-4 w-4"/>
                </div>
                <div className="top-50 left-50">
                    <img src={"/dragable.svg"} alt="close" className="h-4 w-4"/>
                </div>
                {
                    index === 0 &&
                    <div className="top-50 left-50">
                        커버 이미지
                    </div>
                }
            </div>
        );
    }

    return (
        <>
            {
                index === 0 ?
                    <div ref={ref} data-handler-id={handlerId} className=" cursor-move col-span-2 row-span-2 h-54 w-54 flex rounded overflow-hidden" onMouseOver={() => handleMouseOver(image)} onMouseOut={() => handleMouseOut(image)}>
                        {
                            hoveredImg === image && <div className="h-54 w-54 rounded bg-black absolute bg-opacity-70">
                                {
                                    hoverActionComponent()
                                }
                            </div>
                        }
                        <img src={image} alt="Main_Image" className="w-full h-full object-cover"/>
                    </div>
                    :
                    <div ref={ref} data-handler-id={handlerId} key={index} className="cursor-move w-25 h-25 rounded overflow-hidden flex" onMouseOver={() => handleMouseOver(image)} onMouseOut={() => handleMouseOut(image)}>
                        {
                            hoveredImg === image &&
                            <div className="h-25 w-25 rounded bg-black absolute bg-opacity-70">
                                {
                                    // hoverActionComponent()
                                }
                            </div>
                        }
                        <img src={image} alt="Sub_image" className="w-full h-full object-cover"/>
                    </div>
            }
        </>
    );
};

export default ImagePreview;


