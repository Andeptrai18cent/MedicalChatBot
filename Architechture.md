S# Source data: Medical Book

### 1. Architechture
* Medical book => extract docs => chunk1, chunk2, chunk3...

* (chunk1, chunk2, chunk3 ...) => Embedding model => Build Sementic => Indea => Knowlegde base

***Khái niệm chunk**:* *một đoạn thông tin liên kết chặt chẽ với nhau, thường là một nhóm từ có ý nghĩa cú pháp hoặc ngữ nghĩa. Tùy vào ngữ cảnh sử dụng, "chunk" có thể có những ý nghĩa cụ thể như sau:*

### 2.Technologies Used

+ Open AI LLM 
+ pinecone
+ Flask

### 3.Creating Virtual Enviroment

- Create a conda enviroment after opening respository
conda create -n medibot python=3.8 -y
### 3.Project Folder Structure

### API and Module
* sentence-transformers/all-MiniLM-L6-v2 (Hugging Face): Là một mô hình embedding mã nguồn mở, được lưu trữ và chia sẻ trên Hugging Face Hub. Việc tải xuống và sử dụng mô hình này thường là miễn phí (dựa trên giấy phép của mô hình). Bạn chạy mô hình này trên tài nguyên tính toán của riêng bạn.
Loại mô hình và chức năng:

* Mô hình OpenAI (ví dụ: GPT): Đây là các mô hình ngôn ngữ lớn (LLMs) có khả năng tạo ra văn bản, trả lời câu hỏi, dịch ngôn ngữ, viết các loại nội dung sáng tạo khác nhau, và hơn thế nữa. Chúng có khả năng hiểu ngữ cảnh phức tạp và tạo ra phản hồi tự nhiên.
sentence-transformers/all-MiniLM-L6-v2 (Hugging Face): Đây là một mô hình embedding. Chức năng chính của nó là chuyển đổi văn bản (câu, đoạn văn, tài liệu) thành các vector embedding. Các vector này là các dãy số thực nắm bắt ý nghĩa ngữ nghĩa của văn bản. Các văn bản có ý nghĩa tương tự sẽ có các vector embedding gần nhau trong không gian vector. Mô hình embedding không trực tiếp tạo ra câu trả lời bằng ngôn ngữ tự nhiên.
Cách sử dụng trong chatbot của bạn:

* OpenAI API (cho việc tạo câu trả lời): Nếu chatbot của bạn sử dụng OpenAI API (ví dụ: gọi các mô hình GPT), thì OpenAI sẽ chịu trách nhiệm chính cho việc tạo ra câu trả lời dựa trên prompt bạn cung cấp (bao gồm cả ngữ cảnh được truy xuất). Bạn trả tiền cho mỗi lần gọi API này.
sentence-transformers/all-MiniLM-L6-v2 (cho việc truy xuất thông tin - Retrieval): Mô hình embedding như all-MiniLM-L6-v2 thường được sử dụng trong giai đoạn Retrieval-Augmented Generation (RAG) của một chatbot. Quá trình này diễn ra như sau:
Tạo embeddings cho cơ sở dữ liệu kiến thức của bạn: Bạn sử dụng mô hình embedding để chuyển đổi tất cả các tài liệu trong cơ sở dữ liệu kiến thức của mình thành các vector embedding và lưu trữ chúng trong một vector store (ví dụ: Pinecone, ChromaDB).
Tạo embedding cho câu hỏi của người dùng: Khi người dùng đặt câu hỏi, bạn sử dụng cùng một mô hình embedding để chuyển đổi câu hỏi thành một vector embedding.

* Tìm kiếm ngữ nghĩa: Bạn thực hiện tìm kiếm tương đồng trong vector store để tìm ra các vector embedding gần nhất với vector embedding của câu hỏi. Điều này giúp xác định các đoạn văn bản hoặc tài liệu trong cơ sở dữ liệu kiến thức có liên quan nhất đến câu hỏi.
Truyền ngữ cảnh cho LLM: Các đoạn văn bản liên quan được truy xuất sẽ được đưa vào prompt cùng với câu hỏi của người dùng.
Tạo câu trả lời (sử dụng LLM): Một mô hình ngôn ngữ lớn (LLM) (ví dụ: từ OpenAI API hoặc một mô hình LLM mã nguồn mở khác) sẽ sử dụng ngữ cảnh được cung cấp để tạo ra câu trả lời cho người dùng.
Mối liên quan đến chatbot của bạn:

Nếu chatbot của bạn đang sử dụng kiến trúc RAG, thì:

sentence-transformers/all-MiniLM-L6-v2 (thông qua HuggingFaceEmbeddings) có thể được sử dụng để tạo ra các embeddings cho cơ sở dữ liệu kiến thức và cho câu hỏi của người dùng trong quá trình truy xuất thông tin liên quan.
OpenAI API (với các mô hình GPT) có thể được sử dụng để tạo ra câu trả lời cuối cùng dựa trên câu hỏi và ngữ cảnh được truy xuất.
Nếu chatbot của bạn không sử dụng RAG và chỉ dựa vào khả năng của một LLM duy nhất (ví dụ: chỉ gọi OpenAI API trực tiếp với câu hỏi của người dùng), thì mô hình embedding sentence-transformers/all-MiniLM-L6-v2 có thể không được sử dụng trực tiếp trong quá trình tạo câu trả lời.

Tóm lại:

Mô hình embedding (như all-MiniLM-L6-v2) giúp chatbot tìm kiếm thông tin liên quan.
Mô hình ngôn ngữ lớn (như các mô hình OpenAI GPT) giúp chatbot hiểu câu hỏi và tạo ra câu trả lời bằng ngôn ngữ tự nhiên.
Thông thường, trong một hệ thống chatbot QA phức tạp và hiệu quả, bạn sẽ sử dụng cả hai loại mô hình này: mô hình embedding cho việc truy xuất thông tin và mô hình ngôn ngữ lớn cho việc tạo câu trả lời. Việc sử dụng mô hình embedding từ Hugging Face cho việc truy xuất có thể giúp giảm chi phí so với việc sử dụng các dịch vụ embedding trả phí, trong khi bạn vẫn có thể tận dụng khả năng tạo sinh mạnh mẽ của OpenAI API cho việc tạo câu trả lời cuối cùng.

### Embedding và Vector
* Embedding: Giống như việc bạn chuyển đổi một từ, một câu, hoặc thậm chí cả một đoạn văn thành một "mã số đặc biệt". Mã số này không chỉ là một con số đơn thuần mà là một dãy số (vector). Mã số này được thiết kế sao cho những từ, câu, hay đoạn văn có ý nghĩa tương tự nhau sẽ có những "mã số" gần giống nhau.

* Vector: Chính là cái "dãy số đặc biệt" mà embedding tạo ra. Bạn có thể tưởng tượng nó như một mũi tên trong không gian nhiều chiều. Mỗi chiều của không gian này đại diện cho một đặc điểm ngữ nghĩa nào đó của văn bản. Độ dài và hướng của mũi tên (vector) thể hiện ý nghĩa và mối quan hệ của văn bản đó với các văn bản khác.

Tóm lại:
Embedding là quá trình biến văn bản thành vector, và vector là dãy số (mã số) biểu diễn ý nghĩa của văn bản trong một không gian số học, giúp máy tính hiểu được sự tương đồng giữa các đoạn văn bản.