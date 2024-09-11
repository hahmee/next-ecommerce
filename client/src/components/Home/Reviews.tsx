import Image from "next/image";

const Reviews = ({ productId }: { productId: number }) => {

    //리뷰 가져오는 코드
    const reviews = [{data: 1}, {data: 2}, {data: 3}, {data: 4}];
    return reviews.map((review: any, id: number) => (
        <div className="flex flex-col gap-4" key={id}>
            {/* USER */}
            <div className="flex items-center gap-4 font-medium">
                <Image
                    // src={review.customer.avatar_url}
                    src="https://images.pexels.com/photos/17867705/pexels-photo-17867705/free-photo-of-crowd-of-hikers-on-the-mountain-ridge-at-dusk.jpeg?auto=compress&cs=tinysrgb&w=800&lazy=load"
                    alt=""
                    width={32}
                    height={32}
                    className="rounded-full"
                />
                <span>asdfasdfasdf</span>
            </div>
            {/* STARS */}
            <div className="flex gap-2">
                {Array.from({length: 5}).map((_, index) => (
                    <Image src="/star.png" alt="" key={index} width={16} height={16}/>
                ))}
            </div>
            {/* DESC */}
            <p>asdfasd</p>
            <p>asdfasdfasdf Lorem ipsum dolor sit amet, consectetur adipisicing elit. A accusantium adipisci aperiam dolor dolorem eum excepturi ipsum magnam nihil, officiis quaerat, quia quibusdam, recusandae repudiandae sit sunt totam vitae voluptatum.</p>
            <div className="">
                {/*{review.media.map((media: any) => (*/}
                {/*    <Image*/}
                {/*        src={media.url}*/}
                {/*        key={media.id}*/}
                {/*        alt=""*/}
                {/*        width={100}*/}
                {/*        height={50}*/}
                {/*        className="object-cover"*/}
                {/*    />*/}
                {/*))}*/}
            </div>
        </div>
    ));
};

export default Reviews;
