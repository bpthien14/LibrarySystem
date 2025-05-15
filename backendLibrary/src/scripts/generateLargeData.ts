import mongoose from "mongoose";
import dotenv from "dotenv";
import { faker } from "@faker-js/faker/locale/vi";
import { connectToDatabase } from "../utils/database";

import Author from "../models/author.model";
import Category from "../models/category.model";
import Publisher from "../models/publisher.model";
import Book from "../models/book.model";
import Member from "../models/member.model";
import Staff from "../models/staff.model";
import User from "../models/user.model";
import Borrowing from "../models/borrowing.model";
import Reservation from "../models/reservation.model";
import Review from "../models/review.model";
import Fine from "../models/fine.model";

dotenv.config();

const AUTHOR_COUNT = 100;
const CATEGORY_COUNT = 30;
const PUBLISHER_COUNT = 50;
const BOOK_COUNT = 500;
const MEMBER_COUNT = 200;
const STAFF_COUNT = 50;
const USER_COUNT = MEMBER_COUNT + STAFF_COUNT;
const BORROWING_COUNT = 300;
const RESERVATION_COUNT = 150;
const REVIEW_COUNT = 400;
const FINE_COUNT = 100;

const clearDatabase = async () => {
    console.log("Xóa dữ liệu cũ...");
    await Review.deleteMany({});
    await Fine.deleteMany({});
    await Reservation.deleteMany({});
    await Borrowing.deleteMany({});
    await User.deleteMany({});
    await Staff.deleteMany({});
    await Member.deleteMany({});
    await Book.deleteMany({});
    await Publisher.deleteMany({});
    await Category.deleteMany({});
    await Author.deleteMany({});
};

// Tạo dữ liệu mẫu ngẫu nhiên
const generateLargeData = async () => {
    try {
        await connectToDatabase();
        await clearDatabase();

        // 1. Tạo danh mục sách
        console.log("Tạo danh mục sách...");
        const mainCategories = [
            "Văn học",
            "Kinh tế",
            "Khoa học",
            "Công nghệ",
            "Kỹ năng sống",
            "Lịch sử",
            "Nghệ thuật",
            "Y học",
            "Tâm lý",
            "Giáo dục",
        ];

        const categoryData = [];

        for (const catName of mainCategories) {
            categoryData.push({
                name: catName,
                description: `Sách thuộc thể loại ${catName.toLowerCase()}`,
            });
        }

        let remainingCategories = CATEGORY_COUNT - mainCategories.length;
        for (let i = 0; i < remainingCategories; i++) {
            const parentIndex = Math.floor(
                Math.random() * mainCategories.length
            );
            const parentName = mainCategories[parentIndex];
            const subcatName = `${parentName} ${faker.word.noun()}`;

            categoryData.push({
                name: subcatName,
                description: `Sách thuộc thể loại ${subcatName.toLowerCase()}`,
            });
        }

        const categories = await Category.create(categoryData);

        console.log("Tạo tác giả...");
        const authorData = [];

        for (let i = 0; i < AUTHOR_COUNT; i++) {
            const birthYear = faker.date
                .between({ from: "1920-01-01", to: "2000-01-01" })
                .getFullYear();
            const isDeceased = faker.datatype.boolean(0.3); // 30% tác giả đã mất

            authorData.push({
                name: faker.person.fullName(),
                biography: faker.lorem.paragraph(),
                nationality: faker.location.country(),
                birthYear: birthYear,
                deathYear: isDeceased
                    ? birthYear + Math.floor(20 + Math.random() * 60)
                    : null,
                bookCount: 0,
            });
        }

        const authors = await Author.create(authorData);

        // 3. Tạo nhà xuất bản
        console.log("Tạo nhà xuất bản...");
        const publisherData = [];

        const publisherPrefixes = [
            "NXB",
            "Nhà xuất bản",
            "Tủ sách",
            "Công ty Sách",
        ];

        for (let i = 0; i < PUBLISHER_COUNT; i++) {
            const prefix =
                publisherPrefixes[
                    Math.floor(Math.random() * publisherPrefixes.length)
                ];
            publisherData.push({
                name: `${prefix} ${faker.company.name()} ${faker.string.alphanumeric(
                    4
                )}`,
                address:
                    faker.location.streetAddress() +
                    ", " +
                    faker.location.city(),
                phone: `0${faker.string.numeric(9)}`,
                email: faker.internet.email().toLowerCase(),
                website: `https://www.${faker.internet.domainWord()}.com`,
            });
        }

        const publishers = await Publisher.create(publisherData);

        // 4. Tạo sách
        console.log("Tạo sách...");
        const bookData = [];
        const bookTitlePrefix = [
            "Bí mật của",
            "Hành trình",
            "Cuộc sống",
            "Khám phá",
            "Nghệ thuật",
            "Tương lai của",
            "Lịch sử",
            "Thế giới",
            "Giải mã",
            "Bản chất của",
        ];

        const authorBookCount = new Array(authors.length).fill(0);

        for (let i = 0; i < BOOK_COUNT; i++) {
            const authorIndex = Math.floor(Math.random() * authors.length);
            const selectedAuthor = authors[authorIndex];

            authorBookCount[authorIndex]++;

            const prefix =
                bookTitlePrefix[
                    Math.floor(Math.random() * bookTitlePrefix.length)
                ];
            const title = `${prefix} ${faker.word.adjective()} ${faker.word.noun()}`;

            const publisher =
                publishers[Math.floor(Math.random() * publishers.length)];
            const category =
                categories[Math.floor(Math.random() * categories.length)];

            const copyCount = 1 + Math.floor(Math.random() * 5);
            const copies = [];

            for (let j = 0; j < copyCount; j++) {
                const copyId = `${title.substring(0, 2).toUpperCase()}${i
                    .toString()
                    .padStart(3, "0")}-${j + 1}`;
                const statuses = ["Có sẵn", "Đang mượn", "Bảo trì", "Mất"];
                const statusWeights = [0.7, 0.2, 0.07, 0.03]; // 70% có sẵn, 20% đang mượn, 7% bảo trì, 3% mất

                let statusIndex = 0;
                const randomVal = Math.random();
                let cumulativeWeight = 0;

                for (let k = 0; k < statusWeights.length; k++) {
                    cumulativeWeight += statusWeights[k];
                    if (randomVal < cumulativeWeight) {
                        statusIndex = k;
                        break;
                    }
                }

                copies.push({
                    copyId: copyId,
                    acquisitionDate: faker.date.past({ years: 5 }),
                    status: statuses[statusIndex],
                    shelfLocation: `Kệ ${faker.string
                        .alpha(1)
                        .toUpperCase()}${faker.string.numeric(2)}`,
                    condition: faker.helpers.arrayElement([
                        "Mới",
                        "Tốt",
                        "Trung bình",
                        "Cũ",
                    ]),
                    notes: Math.random() < 0.3 ? faker.lorem.sentence() : "",
                });
            }

            // Tạo thông tin sách
            bookData.push({
                title: title,
                isbn: faker.string.numeric(13),
                publishedYear: faker.date
                    .between({ from: "1950-01-01", to: "2023-01-01" })
                    .getFullYear(),
                language:
                    Math.random() < 0.85
                        ? "Tiếng Việt"
                        : faker.helpers.arrayElement([
                              "Tiếng Anh",
                              "Tiếng Pháp",
                              "Tiếng Nga",
                              "Tiếng Trung",
                          ]),
                pages: Math.floor(100 + Math.random() * 900),
                price: Math.floor(50 + Math.random() * 450) * 1000,
                description: faker.lorem.paragraphs(2),
                category: {
                    _id: category._id,
                    name: category.name,
                },
                authors: [
                    {
                        _id: selectedAuthor._id,
                        name: selectedAuthor.name,
                    },
                ],
                publisher: {
                    _id: publisher._id,
                    name: publisher.name,
                },
                copies: copies,
                averageRating: (3 + Math.random() * 2).toFixed(1),
                totalRatings: Math.floor(Math.random() * 50),
            });
        }

        const books = await Book.create(bookData);

        for (let i = 0; i < authors.length; i++) {
            await Author.findByIdAndUpdate(authors[i]._id, {
                bookCount: authorBookCount[i],
            });
        }

        console.log("Tạo độc giả...");
        const memberData = [];

        for (let i = 0; i < MEMBER_COUNT; i++) {
            const gender = faker.helpers.arrayElement(["Nam", "Nữ"]);
            const firstName =
                gender === "Nam"
                    ? faker.person.firstName("male")
                    : faker.person.firstName("female");
            const lastName = faker.person.lastName();
            const fullName = `${lastName} ${firstName}`;

            const registrationDate = faker.date.past({ years: 3 });
            const expiryDate = new Date(registrationDate);
            expiryDate.setFullYear(expiryDate.getFullYear() + 1);

            memberData.push({
                memberId: `DG${(i + 1).toString().padStart(4, "0")}`,
                fullName: fullName,
                gender: gender,
                dateOfBirth: faker.date.between({
                    from: "1960-01-01",
                    to: "2010-01-01",
                }),
                address:
                    faker.location.streetAddress() +
                    ", " +
                    faker.location.city(),
                phone: `0${faker.string.numeric(9)}`,
                email: faker.internet
                    .email({ firstName, lastName })
                    .toLowerCase(),
                registrationDate: registrationDate,
                expiryDate: expiryDate,
                status: faker.helpers.arrayElement([
                    "Hoạt động",
                    "Hoạt động",
                    "Hoạt động",
                    "Tạm khóa",
                    "Hết hạn",
                ]), // 60% hoạt động
                currentBorrowings: [],
                borrowingHistory: {
                    totalBorrowed: Math.floor(Math.random() * 15),
                    totalOverdue: Math.floor(Math.random() * 3),
                },
                fines: {
                    totalAmount: Math.floor(Math.random() * 5) * 5000,
                    unpaidAmount: Math.floor(Math.random() * 3) * 5000,
                },
            });
        }

        const members = await Member.create(memberData);

        console.log("Tạo nhân viên...");
        const staffData = [];
        const positions = [
            "Thủ thư",
            "Quản lý",
            "Nhân viên kỹ thuật",
            "Nhân viên hành chính",
            "Nhân viên bảo vệ",
        ];
        const roles = ["admin", "librarian", "staff"];

        for (let i = 0; i < STAFF_COUNT; i++) {
            const gender = faker.helpers.arrayElement(["Nam", "Nữ"]);
            const firstName =
                gender === "Nam"
                    ? faker.person.firstName("male")
                    : faker.person.firstName("female");
            const lastName = faker.person.lastName();
            const fullName = `${lastName} ${firstName}`;

            const position = faker.helpers.arrayElement(positions);
            let role = "staff";

            if (position === "Thủ thư") role = "librarian";
            if (position === "Quản lý")
                role = Math.random() < 0.7 ? "admin" : "librarian";

            staffData.push({
                staffId: `NV${(i + 1).toString().padStart(4, "0")}`,
                fullName: fullName,
                gender: gender,
                dateOfBirth: faker.date.between({
                    from: "1970-01-01",
                    to: "2000-01-01",
                }),
                address:
                    faker.location.streetAddress() +
                    ", " +
                    faker.location.city(),
                phone: `0${faker.string.numeric(9)}`,
                email: faker.internet
                    .email({ firstName, lastName })
                    .toLowerCase(),
                position: position,
                startDate: faker.date.past({ years: 10 }),
                salary: Math.floor(5 + Math.random() * 15) * 1000000,
                status: faker.helpers.arrayElement([
                    "Đang làm việc",
                    "Đang làm việc",
                    "Đang làm việc",
                    "Nghỉ phép",
                    "Đã nghỉ việc",
                ]),
                account: {
                    username: faker.internet
                        .userName({ firstName, lastName })
                        .toLowerCase(),
                    role: role,
                },
            });
        }

        const staffMembers = await Staff.create(staffData);

        console.log("Tạo tài khoản người dùng...");
        const userData = [];

        for (const staff of staffMembers) {
            if (staff.status !== "Đã nghỉ việc") {
                userData.push({
                    username: staff.account.username,
                    password:
                        "$2a$10$X7.H/Di5CZzpEf8JZly0OuRnJrEXirshdWL5UBvpSi9hiUMZ3iqUu", // password123
                    role: staff.account.role,
                    staffId: staff._id,
                    memberId: null,
                    status: "Hoạt động",
                    lastLogin:
                        Math.random() < 0.7
                            ? faker.date.recent({ days: 30 })
                            : null,
                    loginHistory: faker.helpers.multiple(
                        () => ({
                            timestamp: faker.date.recent({ days: 90 }),
                            ipAddress: faker.internet.ipv4(),
                        }),
                        { count: Math.floor(Math.random() * 10) }
                    ),
                });
            }
        }

        for (const member of members) {
            if (member.status === "Hoạt động") {
                userData.push({
                    username: faker.internet
                        .userName({
                            firstName: member.fullName.split(" ").pop(),
                            lastName: member.fullName.split(" ")[0],
                        })
                        .toLowerCase(),
                    password:
                        "$2a$10$X7.H/Di5CZzpEf8JZly0OuRnJrEXirshdWL5UBvpSi9hiUMZ3iqUu", // password123
                    role: "member",
                    staffId: null,
                    memberId: member._id,
                    status: "Hoạt động",
                    lastLogin:
                        Math.random() < 0.6
                            ? faker.date.recent({ days: 60 })
                            : null,
                    loginHistory: faker.helpers.multiple(
                        () => ({
                            timestamp: faker.date.recent({ days: 120 }),
                            ipAddress: faker.internet.ipv4(),
                        }),
                        { count: Math.floor(Math.random() * 8) }
                    ),
                });
            }
        }

        const users = await User.create(userData);

        console.log("Tạo mượn sách...");
        const borrowingData = [];
        const activeBorrowings = [];

        // generic type <Array<{book: any, borrowableCopies: any}>>
        const borrowableBooks = books.reduce<
            Array<{ book: any; borrowableCopies: any }>
        >((acc, book) => {
            const borrowableCopies = book.copies.filter(
                (copy) => copy.status === "Đang mượn"
            );
            if (borrowableCopies.length > 0) {
                acc.push({
                    book,
                    borrowableCopies,
                });
            }
            return acc;
        }, []);

        const activeMembers = members.filter(
            (member) => member.status === "Hoạt động"
        );
        const activeStaff = staffMembers.filter(
            (staff) => staff.status === "Đang làm việc"
        );

        for (let i = 0; i < BORROWING_COUNT; i++) {
            let status = "Đang mượn";
            const statusRandom = Math.random();
            if (statusRandom > 0.6 && statusRandom <= 0.9) {
                status = "Đã trả";
            } else if (statusRandom > 0.9) {
                status = "Quá hạn";
            }

            const bookIndex = Math.floor(
                Math.random() * borrowableBooks.length
            );
            const selectedBook = borrowableBooks[bookIndex].book;
            const copyIndex = Math.floor(
                Math.random() *
                    borrowableBooks[bookIndex].borrowableCopies.length
            );
            const selectedCopy =
                borrowableBooks[bookIndex].borrowableCopies[copyIndex];

            const selectedMember =
                activeMembers[Math.floor(Math.random() * activeMembers.length)];
            const issueStaff =
                activeStaff[Math.floor(Math.random() * activeStaff.length)];

            const borrowDate = faker.date.recent({ days: 60 });
            const dueDate = new Date(borrowDate);
            dueDate.setDate(dueDate.getDate() + 14); // 14 ngày hạn mượn

            let returnDate = null;
            let returnStaff = null;
            if (status === "Đã trả") {
                // 80% trả đúng hạn, 20% trả trễ
                if (Math.random() < 0.8) {
                    returnDate = new Date(borrowDate);
                    returnDate.setDate(
                        returnDate.getDate() + Math.floor(Math.random() * 14)
                    ); // Trả trong vòng 14 ngày
                } else {
                    returnDate = new Date(dueDate);
                    returnDate.setDate(
                        returnDate.getDate() +
                            Math.floor(1 + Math.random() * 10)
                    ); // Trả trễ 1-10 ngày
                }
                returnStaff =
                    activeStaff[Math.floor(Math.random() * activeStaff.length)];
            }

            const fineInfo = {
                amount: 0,
                reason: "",
                status: "Không có",
            };

            if (status === "Quá hạn") {
                const daysOverdue = Math.floor(1 + Math.random() * 30); // 1-30 ngày quá hạn
                fineInfo.amount = daysOverdue * 5000; // 5.000 VND/ngày
                fineInfo.reason = `Trả sách trễ ${daysOverdue} ngày`;
                fineInfo.status = "Chưa thanh toán";
            } else if (
                status === "Đã trả" &&
                returnDate &&
                returnDate > dueDate
            ) {
                const daysOverdue = Math.floor(
                    (returnDate.getTime() - dueDate.getTime()) /
                        (1000 * 60 * 60 * 24)
                );
                fineInfo.amount = daysOverdue * 5000;
                fineInfo.reason = `Trả sách trễ ${daysOverdue} ngày`;
                fineInfo.status =
                    Math.random() < 0.7 ? "Đã thanh toán" : "Chưa thanh toán";
            }

            // Tạo bản ghi mượn
            const borrowing = {
                borrowingId: `MT${(i + 1).toString().padStart(6, "0")}`,
                member: {
                    _id: selectedMember._id,
                    memberId: selectedMember.memberId,
                    fullName: selectedMember.fullName,
                },
                bookCopy: {
                    bookId: selectedBook._id,
                    copyId: selectedCopy.copyId,
                    title: selectedBook.title,
                },
                issuedBy: {
                    _id: issueStaff._id,
                    staffId: issueStaff.staffId,
                    fullName: issueStaff.fullName,
                },
                borrowDate: borrowDate,
                dueDate: dueDate,
                returnDate: returnDate,
                returnedTo: returnStaff
                    ? {
                          _id: returnStaff._id,
                          staffId: returnStaff.staffId,
                          fullName: returnStaff.fullName,
                      }
                    : null,
                status: status,
                renewalCount: Math.floor(Math.random() * 3),
                notes: Math.random() < 0.2 ? faker.lorem.sentence() : "",
                fine: fineInfo,
            };

            borrowingData.push(borrowing);

            // Nếu đang mượn, thêm vào danh sách mượn đang active
            if (status === "Đang mượn" || status === "Quá hạn") {
                activeBorrowings.push({
                    borrowing,
                    memberId: selectedMember._id,
                });
            }
        }

        const borrowings = await Borrowing.create(borrowingData);

        // Cập nhật currentBorrowings cho member
        console.log("Cập nhật thông tin mượn sách cho độc giả...");
        for (const { borrowing, memberId } of activeBorrowings) {
            // Tìm vị trí của borrowing trong mảng
            const borrowingIndex = borrowings.findIndex(
                (b) => b.borrowingId === borrowing.borrowingId
            );

            if (borrowingIndex >= 0) {
                await Member.findByIdAndUpdate(memberId, {
                    $push: {
                        currentBorrowings: {
                            borrowingId: borrowings[borrowingIndex]._id,
                            bookCopyId: borrowing.bookCopy.copyId,
                            bookTitle: borrowing.bookCopy.title,
                            dueDate: borrowing.dueDate,
                        },
                    },
                });
            }
        }

        // Cập nhật borrowingHistory cho members
        for (const member of members) {
            const memberBorrowings = borrowings.filter(
                (b) => b.member?._id?.toString() === member?._id?.toString()
            );
            const totalBorrowed = memberBorrowings.length;
            const totalOverdue = memberBorrowings.filter(
                (b) =>
                    b.status === "Quá hạn" ||
                    (b.returnDate && b.returnDate > b.dueDate)
            ).length;

            let lastBorrowing = null;
            if (memberBorrowings.length > 0) {
                lastBorrowing = memberBorrowings.sort(
                    (a, b) =>
                        new Date(b.borrowDate).getTime() -
                        new Date(a.borrowDate).getTime()
                )[0].borrowDate;
            }

            await Member.findByIdAndUpdate(member._id, {
                "borrowingHistory.totalBorrowed": totalBorrowed,
                "borrowingHistory.totalOverdue": totalOverdue,
                "borrowingHistory.lastBorrowing": lastBorrowing,
            });
        }

        // 9. Tạo đánh giá sách
        console.log("Tạo đánh giá sách...");
        const reviewData = [];

        for (let i = 0; i < REVIEW_COUNT; i++) {
            const book = books[Math.floor(Math.random() * books.length)];
            const member = members[Math.floor(Math.random() * members.length)];
            const rating = Math.floor(1 + Math.random() * 5);

            reviewData.push({
                book: {
                    _id: book._id,
                    title: book.title,
                },
                member: {
                    _id: member._id,
                    memberId: member.memberId,
                    fullName: member.fullName,
                },
                rating: rating,
                content: Math.random() < 0.8 ? faker.lorem.paragraph() : "", // 80% có nội dung
                reviewDate: faker.date.recent({ days: 180 }),
                likes: Math.floor(Math.random() * 20),
                status: faker.helpers.arrayElement([
                    "Đã duyệt",
                    "Đã duyệt",
                    "Đã duyệt",
                    "Chờ duyệt",
                    "Từ chối",
                ]),
            });
        }

        await Review.create(reviewData);

        // 10. Tạo tiền phạt
        console.log("Tạo tiền phạt...");
        const fineData = [];

        // Lọc các borrowing có fine > 0
        const borrowingsWithFines = borrowings.filter((b) => b.fine.amount > 0);

        for (
            let i = 0;
            i < Math.min(FINE_COUNT, borrowingsWithFines.length);
            i++
        ) {
            const borrowing = borrowingsWithFines[i];
            const receivingStaff =
                activeStaff[Math.floor(Math.random() * activeStaff.length)];

            const isPaid = borrowing.fine.status === "Đã thanh toán";
            const issueDate = new Date(borrowing.returnDate || new Date());

            let paymentDate = null;
            if (isPaid) {
                paymentDate = new Date(issueDate);
                paymentDate.setDate(
                    paymentDate.getDate() + Math.floor(1 + Math.random() * 7)
                ); // Thanh toán trong vòng 1-7 ngày
            }

            fineData.push({
                member: {
                    _id: borrowing.member._id,
                    memberId: borrowing.member.memberId,
                    fullName: borrowing.member.fullName,
                },
                borrowing: borrowing._id,
                book: {
                    _id: borrowing.bookCopy.bookId,
                    title: borrowing.bookCopy.title,
                    copyId: borrowing.bookCopy.copyId,
                },
                amount: borrowing.fine.amount,
                reason: borrowing.fine.reason || "Trả sách trễ hạn",
                issueDate: issueDate,
                status: isPaid ? "Đã thanh toán" : "Chưa thanh toán",
                paymentDate: paymentDate,
                receivedBy: isPaid
                    ? {
                          _id: receivingStaff._id,
                          staffId: receivingStaff.staffId,
                          fullName: receivingStaff.fullName,
                      }
                    : null,
            });
        }

        await Fine.create(fineData);

        // 11. Tạo đặt trước sách
        console.log("Tạo đặt trước sách...");
        const reservationData = [];

        for (let i = 0; i < RESERVATION_COUNT; i++) {
            const book = books[Math.floor(Math.random() * books.length)];
            const member = members[Math.floor(Math.random() * members.length)];

            const reservationDate = faker.date.recent({ days: 30 });
            const expiryDate = new Date(reservationDate);
            expiryDate.setDate(expiryDate.getDate() + 7);

            const statuses = ["Đang chờ", "Đã nhận", "Đã hủy", "Hết hạn"];
            const statusWeights = [0.4, 0.3, 0.2, 0.1];

            let statusIndex = 0;
            const randomVal = Math.random();
            let cumulativeWeight = 0;

            for (let j = 0; j < statusWeights.length; j++) {
                cumulativeWeight += statusWeights[j];
                if (randomVal < cumulativeWeight) {
                    statusIndex = j;
                    break;
                }
            }

            const status = statuses[statusIndex];

            const notificationSent = Math.random() < 0.8;
            let notificationDate = null;

            if (notificationSent) {
                notificationDate = new Date(reservationDate);
                notificationDate.setDate(
                    notificationDate.getDate() +
                        Math.floor(1 + Math.random() * 3)
                );
            }

            reservationData.push({
                member: {
                    _id: member._id,
                    memberId: member.memberId,
                    fullName: member.fullName,
                },
                book: {
                    _id: book._id,
                    title: book.title,
                },
                reservationDate: reservationDate,
                expiryDate: expiryDate,
                status: status,
                notificationSent: notificationSent,
                notificationDate: notificationDate,
                notes: Math.random() < 0.2 ? faker.lorem.sentence() : "",
            });
        }

        await Reservation.create(reservationData);

        console.log("✅ Tạo dữ liệu lớn thành công!");
        console.log(`Đã tạo:
      - ${AUTHOR_COUNT} tác giả
      - ${CATEGORY_COUNT} danh mục
      - ${PUBLISHER_COUNT} nhà xuất bản
      - ${BOOK_COUNT} sách
      - ${MEMBER_COUNT} độc giả
      - ${STAFF_COUNT} nhân viên
      - ${userData.length} tài khoản người dùng
      - ${BORROWING_COUNT} lượt mượn sách
      - ${RESERVATION_COUNT} đặt trước
      - ${REVIEW_COUNT} đánh giá
      - ${fineData.length} tiền phạt
    `);
    } catch (error) {
        console.error("❌ Lỗi khi tạo dữ liệu lớn:", error);
    } finally {
        // Đóng kết nối khi hoàn thành
        mongoose.connection.close();
    }
};

generateLargeData();
