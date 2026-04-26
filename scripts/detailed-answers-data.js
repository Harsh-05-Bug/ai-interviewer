// Detailed answers for theory questions
// Format: { topic: { questionTitle: detailedAnswer } }
// Progress so far: OOP (36/36 complete), OS (20/40 in progress)
// Remaining: OS Part 2 (20 questions), DBMS (35), Networks (35), System Design (36)

const detailedAnswers = {
  'OOP': {
    'Four Pillars OOP': `## Definition
The four pillars of Object-Oriented Programming are **Encapsulation**, **Abstraction**, **Inheritance**, and **Polymorphism**. Together, they form the foundation of how OOP organizes code into reusable, maintainable structures.

## Why It Matters
These principles are the most commonly asked OOP question in interviews. Understanding them shows you can design clean, scalable software — not just write code that works.

## Detailed Explanation

**Encapsulation** means bundling data (fields) and methods that operate on that data into a single unit (a class), while restricting direct access to internal state. You expose only what's necessary through public methods (getters/setters), hiding the rest with private/protected modifiers. This protects the object's integrity from outside interference.

**Abstraction** means exposing only essential features while hiding implementation complexity. When you use a \`List.add()\` method, you don't need to know if it's an array or linked list underneath. Abstraction is achieved through abstract classes and interfaces.

**Inheritance** allows a class (child) to acquire properties and methods of another class (parent). This promotes code reuse — a \`Dog\` class inheriting from \`Animal\` automatically gets \`eat()\` and \`sleep()\` methods. Use carefully: favor composition when the relationship isn't truly "is-a".

**Polymorphism** means "many forms" — the same interface behaves differently based on the object. A \`shape.draw()\` call draws a circle or square depending on the actual object type. Achieved via method overriding (runtime) or overloading (compile-time).

## Real-World Example
Consider a payment system: \`Payment\` is an abstract class. \`CreditCardPayment\`, \`UPIPayment\`, and \`PayPalPayment\` inherit from it. Each implements \`processPayment()\` differently (polymorphism). Card numbers are private fields accessed via methods (encapsulation). Users call \`payment.process()\` without knowing internal details (abstraction).

## Interview Tips
- Give one real-world example per pillar — don't just recite definitions
- Know which pillar solves which problem (encapsulation → data safety, inheritance → reuse, etc.)
- Be ready to write a code snippet demonstrating each

## Common Follow-up Questions
1. Can you have OOP without inheritance? (Yes — composition over inheritance is increasingly preferred)
2. Difference between abstraction and encapsulation? (Abstraction hides complexity; encapsulation hides data)
3. Is JavaScript truly object-oriented? (Prototype-based, supports all four pillars but differently than Java)`,

    'SOLID Principles': `## Definition
SOLID is an acronym for five design principles that make software designs more understandable, flexible, and maintainable: **S**ingle Responsibility, **O**pen/Closed, **L**iskov Substitution, **I**nterface Segregation, and **D**ependency Inversion.

## Why It Matters
SOLID separates senior engineers from juniors. Most real-world bugs, painful refactors, and unmaintainable codebases violate one or more of these principles. Every major framework (Spring, Angular, .NET) is built on SOLID.

## Detailed Explanation

**S — Single Responsibility Principle**: A class should have only one reason to change. A \`User\` class shouldn't handle database persistence AND email sending AND password hashing. Split into \`User\`, \`UserRepository\`, \`EmailService\`, \`PasswordHasher\`. Each change affects only one class.

**O — Open/Closed Principle**: Classes should be open for extension but closed for modification. Adding a new payment method shouldn't require editing existing payment code — instead, add a new class that implements the \`PaymentMethod\` interface. This prevents breaking working features when adding new ones.

**L — Liskov Substitution Principle**: Subclasses must be substitutable for their parent class without breaking behavior. If \`Bird.fly()\` exists and \`Penguin extends Bird\`, you've violated LSP — penguins can't fly. The fix: restructure so \`FlyingBird\` is a subtype.

**I — Interface Segregation Principle**: Don't force classes to implement methods they don't use. Instead of one giant \`Worker\` interface with \`work()\`, \`eat()\`, \`sleep()\`, split into \`Workable\`, \`Eatable\`, \`Sleepable\`. A \`Robot\` class only implements \`Workable\`.

**D — Dependency Inversion Principle**: High-level modules shouldn't depend on low-level modules — both should depend on abstractions. Instead of \`OrderService\` directly using \`MySQLDatabase\`, make it depend on a \`Database\` interface. Now you can swap MySQL for PostgreSQL without touching \`OrderService\`.

## Real-World Example
An e-commerce checkout: \`CheckoutService\` (high-level) depends on \`PaymentGateway\` interface (abstraction), not Stripe SDK directly (low-level). You can plug in Stripe, Razorpay, or a mock for testing — checkout code never changes. This is all five SOLID principles working together.

## Interview Tips
- Memorize one concrete violation example per principle
- Know why each principle exists (the pain it prevents)
- Be ready to refactor bad code using SOLID in a whiteboard question

## Common Follow-up Questions
1. Which SOLID principle is most violated in practice? (Usually Single Responsibility)
2. How does Dependency Injection relate to DIP? (DI is one technique to achieve DIP)
3. Can you over-apply SOLID? (Yes — creates unnecessary abstraction layers in simple code)`,

    'Singleton Factory Observer': `## Definition
Three of the most commonly used design patterns: **Singleton** (ensures only one instance of a class exists), **Factory** (creates objects without exposing the creation logic), and **Observer** (lets objects subscribe to events and get notified automatically).

## Why It Matters
These three patterns appear in virtually every interview and every production codebase. Singleton manages shared resources, Factory decouples object creation, and Observer is the backbone of event-driven architecture.

## Detailed Explanation

**Singleton Pattern**: Guarantees a class has only one instance and provides a global access point. Used for shared resources — database connections, logging, configuration, caches. Implementation requires a private constructor, a static instance field, and a public \`getInstance()\` method. Thread-safety matters: use double-checked locking or language-specific constructs (Java's \`enum\`, Python's module-level singletons).

**Factory Pattern**: Centralizes object creation so callers don't need to know which concrete class to instantiate. Instead of \`new CreditCard()\` or \`new UPI()\` scattered everywhere, call \`PaymentFactory.create("credit")\`. Two variants: Simple Factory (one method decides) and Abstract Factory (creates families of related objects). Benefits: easier testing, loose coupling, changes in creation logic stay in one place.

**Observer Pattern**: Defines a one-to-many dependency — when the subject's state changes, all observers are automatically notified. Classic example: a news publisher (subject) and subscribers (observers). Subscribers \`subscribe()\` to the publisher; when news breaks, the publisher calls \`notify()\` on each. This decouples publishers from subscribers — neither knows the other's implementation.

## Real-World Example
- **Singleton**: Your database connection pool — \`Database.getInstance()\` returns the same pool everywhere.
- **Factory**: React's \`createElement()\` creates different component types without you using \`new\`.
- **Observer**: DOM events — \`button.addEventListener('click', handler)\` registers an observer. When clicked, all handlers fire.

## Interview Tips
- Know when NOT to use Singleton (most cases — it's often an anti-pattern creating hidden global state)
- For Factory, distinguish Simple Factory vs Factory Method vs Abstract Factory
- Observer → know the trade-off: loose coupling but harder to trace execution flow

## Common Follow-up Questions
1. Why is Singleton considered an anti-pattern by many? (Makes testing hard, hides dependencies, creates global state)
2. What's the difference between Factory Method and Abstract Factory? (Method creates one product; Abstract creates families)
3. How is Observer different from Pub-Sub? (Observer is direct; Pub-Sub has a broker in between)`,

    'Abstract vs Interface': `## Definition
**Abstract classes** are partially implemented classes that can have both concrete methods (with implementation) and abstract methods (without). **Interfaces** are pure contracts — they specify what methods a class must implement but (traditionally) provide no implementation.

## Why It Matters
This is the #1 OOP interview question. Getting it wrong signals weak fundamentals. The right answer shows you understand inheritance, contracts, and when to use each.

## Detailed Explanation

**Abstract classes** exist to share common code among related classes while forcing subclasses to implement specific methods. They can have fields (state), constructors, concrete methods, and abstract methods. A class can extend only ONE abstract class (single inheritance in most languages). Use them when classes share both behavior AND state — e.g., \`Animal\` has a \`name\` field and \`eat()\` method, but each subclass implements \`makeSound()\` differently.

**Interfaces** exist to define a contract — "any class implementing this must provide these methods." Traditionally no fields, no constructors, no implementation (though modern languages like Java 8+ added default methods). A class can implement MULTIPLE interfaces. Use them to specify capabilities across unrelated classes — \`Comparable\`, \`Serializable\`, \`Iterable\` don't care if you're a Person or a Pixel.

**Key differences**:
- Abstract class: "is-a" relationship (Dog IS-A Animal)
- Interface: "can-do" relationship (Dog CAN-DO Swimmable)
- Abstract allows constructors; interfaces don't (traditionally)
- Abstract can have private methods and state; interfaces usually cannot
- Single inheritance (abstract) vs multiple inheritance (interface)

## Real-World Example
Consider a game: \`Character\` is an abstract class with shared state like \`health\`, \`position\`, and a concrete \`takeDamage()\` method — all characters lose health the same way. But \`Attackable\`, \`Healable\`, and \`Teleportable\` are interfaces — not every character can do all three. A \`Wizard\` extends \`Character\` AND implements \`Healable\`, \`Teleportable\`. A \`Warrior\` extends \`Character\` AND implements \`Attackable\`.

## Interview Tips
- If asked "which would you choose?", the answer depends on: shared state (abstract), multiple inheritance needs (interface), evolving contract (interface)
- Modern languages blur the line — Java 8 default methods in interfaces, C# has similar
- Know your language's specifics (Python uses ABC module for abstract; JS has no native interfaces)

## Common Follow-up Questions
1. Can an abstract class have no abstract methods? (Yes — but then why abstract? Usually to prevent instantiation)
2. Why allow multiple interface implementation but single class inheritance? (To avoid the Diamond Problem with state)
3. With Java 8 default methods, why still use abstract classes? (State/fields and constructors)`,

    'Composition vs Inheritance': `## Definition
**Inheritance** models "is-a" relationships — a subclass IS A parent class (Dog is an Animal). **Composition** models "has-a" relationships — a class HAS fields that are other objects (Car has an Engine). The principle "favor composition over inheritance" is one of the most important lessons in OOP design.

## Why It Matters
Early OOP design (1990s) overused inheritance, leading to rigid, fragile hierarchies. Modern best practices lean heavily on composition. Interviewers ask this to see if you understand modern design thinking.

## Detailed Explanation

**Inheritance creates tight coupling**: Changes in the parent class ripple down to all subclasses. If you change \`Animal.move()\`, every subclass is affected — potentially breaking. Multi-level hierarchies (GrandAnimal → Animal → Mammal → Dog → Poodle) become maintenance nightmares. The "fragile base class" problem is real.

**Composition is flexible**: Instead of \`ElectricCar extends Car\`, you have \`Car\` with an \`Engine\` field — which could be \`ElectricEngine\`, \`PetrolEngine\`, or \`HybridEngine\`. You can swap engines at runtime. You can combine behaviors — a class can "have" multiple capabilities by containing multiple helper objects, sidestepping single-inheritance limits.

**When inheritance IS appropriate**:
- True "is-a" relationships that won't change (a \`SavingsAccount\` will always be a type of \`Account\`)
- When you need polymorphism via a common parent type
- Framework hooks (e.g., React's \`Component\`) where the parent provides lifecycle infrastructure

**When composition is better**:
- Behavior varies (Strategy pattern)
- Multiple orthogonal capabilities (a \`User\` is both \`Authenticatable\` and \`Loggable\`)
- You want runtime flexibility
- The relationship might change (what if \`ElectricCar\` later needs to be a hybrid?)

## Real-World Example
Bad (inheritance): \`class PremiumGoldUserWithDiscount extends PremiumUser extends User\` — what happens when you want a Premium user WITHOUT discount? You create yet another subclass. Hierarchy explodes.

Good (composition): \`class User { subscription: Subscription; discounts: Discount[]; }\` — subscription and discounts are independent components you plug in. A user can have any combination without new classes.

## Interview Tips
- When asked "inheritance or composition?", default to composition unless the "is-a" is rock-solid
- Know the Gang of Four quote: "Favor object composition over class inheritance"
- Relate it to SOLID — composition supports Open/Closed and Dependency Inversion better

## Common Follow-up Questions
1. What's the Diamond Problem? (Multiple inheritance ambiguity — why Java forbids it but allows multiple interfaces)
2. What's the Decorator pattern? (A composition-based alternative to inheritance for adding behavior)
3. Can composition replace inheritance entirely? (Practically yes, but you lose clean polymorphism syntax)`,

    'Strategy Pattern': `## Definition
The **Strategy Pattern** defines a family of algorithms, encapsulates each one as a separate class, and makes them interchangeable at runtime. It lets the algorithm vary independently from the clients that use it.

## Why It Matters
Strategy is one of the most useful patterns in production code. It eliminates massive if-else chains, supports the Open/Closed Principle, and makes code testable. Any time you have "this same task done in multiple ways," Strategy is your answer.

## Detailed Explanation

The pattern has three parts:

1. **Strategy interface**: Defines the common method all algorithms share (e.g., \`execute()\`, \`calculate()\`).
2. **Concrete strategies**: Each one implements the interface with a specific algorithm.
3. **Context**: The class that uses a strategy. It holds a reference to a strategy object and delegates the work.

Instead of this:
\`\`\`
if (type === "credit") { /* credit logic */ }
else if (type === "upi") { /* upi logic */ }
else if (type === "paypal") { /* paypal logic */ }
\`\`\`

You do this:
\`\`\`
interface PaymentStrategy { pay(amount); }
class CreditPayment implements PaymentStrategy { pay(amount) {...} }
class UPIPayment implements PaymentStrategy { pay(amount) {...} }

class Checkout {
  constructor(strategy) { this.strategy = strategy; }
  process(amount) { this.strategy.pay(amount); }
}
\`\`\`

Now adding a new payment method means creating one new class — no existing code changes. You can swap strategies at runtime (user picks payment method), mock them for testing, or load them dynamically.

## Real-World Example
Google Maps uses Strategy for routing algorithms. \`RouteFinder\` (context) accepts a \`RoutingStrategy\` — could be \`FastestRoute\`, \`ShortestRoute\`, \`AvoidTollsRoute\`, \`WalkingRoute\`, \`PublicTransitRoute\`. Each implements the same \`findPath(start, end)\` method differently. User selects one in the UI; \`RouteFinder\` delegates.

## Interview Tips
- Strategy vs State pattern: Strategy is picked by client; State changes itself based on context
- Know that lambda functions / function pointers are a lightweight Strategy in modern languages
- Mention it when someone shows you a long if-else chain — great refactoring opportunity

## Common Follow-up Questions
1. How is Strategy different from Factory? (Factory creates objects; Strategy chooses algorithms)
2. Can you use Strategy without inheritance? (Yes — pass functions/lambdas as strategies)
3. What's the downside? (More classes to maintain; overkill for 2-3 simple variants)`,

    'Decorator Pattern': `## Definition
The **Decorator Pattern** dynamically adds new behavior to an object without altering its class, by wrapping it in another object that adds the new behavior while preserving the original's interface.

## Why It Matters
Decorator is the elegant answer to "I need to add optional features without creating 2^N subclasses." It's heavily used in I/O streams, middleware, and UI frameworks. Understanding it demonstrates mastery of composition.

## Detailed Explanation

The structure:
1. **Component interface**: Defines the common operations.
2. **Concrete component**: The base object being decorated.
3. **Decorator abstract class**: Implements the component interface and holds a reference to a component.
4. **Concrete decorators**: Add specific behavior before/after calling the wrapped component's method.

The key mechanism: decorators wrap the original object (composition) and implement the same interface — so wrapped objects are indistinguishable from unwrapped ones to the caller. You can stack multiple decorators: \`new LoggingDecorator(new CacheDecorator(new AuthDecorator(new APIService())))\`.

Compare to inheritance: if you had \`APIService\` and wanted optional logging, caching, and auth, pure inheritance would need \`LoggedAPI\`, \`CachedAPI\`, \`AuthedAPI\`, \`LoggedCachedAPI\`, \`LoggedAuthedAPI\`, \`CachedAuthedAPI\`, \`LoggedCachedAuthedAPI\` — 7 classes for 3 features. Decorator lets you mix at runtime with just 4 classes total.

## Real-World Example
Java's I/O library: \`BufferedReader(FileReader(file))\` — \`FileReader\` reads raw bytes, \`BufferedReader\` decorates it with buffering. You could further wrap: \`LineNumberReader(BufferedReader(InputStreamReader(FileInputStream(file))))\` — each layer adds one capability.

In web development, Express.js middleware is a decorator-like pattern: \`app.use(auth).use(logging).use(cache).use(handler)\` — each middleware wraps the next, adding behavior.

## Interview Tips
- Draw the wrapping visually — it clicks instantly
- Emphasize "add behavior without modifying original" — that's the OCP payoff
- Mention real examples: Python decorators (syntactic sugar for this pattern), Java I/O, Express middleware

## Common Follow-up Questions
1. How is Decorator different from Inheritance? (Runtime vs compile-time; composition vs inheritance)
2. Downsides of Decorator? (Lots of small classes; debugging can be confusing with deep nesting)
3. How does Python's \`@decorator\` syntax relate? (Same concept applied to functions)`,

    'MVC Architecture': `## Definition
**MVC (Model-View-Controller)** is an architectural pattern that separates an application into three interconnected parts: **Model** (data and business logic), **View** (user interface), and **Controller** (handles user input and coordinates between Model and View).

## Why It Matters
MVC underlies virtually all web frameworks (Django, Rails, Spring, ASP.NET). Understanding MVC means understanding separation of concerns — the foundation of maintainable software.

## Detailed Explanation

**Model**: Represents the data and the rules that govern access to and modification of it. The Model doesn't know about the View or Controller. Example: a \`User\` class with fields (name, email), validation rules, and database methods. The Model is where business logic lives — password hashing, order total calculation, inventory rules.

**View**: Presents the Model's data to the user. In web apps, these are HTML templates; in desktop apps, GUI components. Views should be "dumb" — they just display whatever they're given. They don't fetch data themselves. Example: a user profile HTML page.

**Controller**: Receives user input, decides what to do (often telling the Model to update), then selects a View to render. Controllers are the glue. Example: when user submits a login form, the Controller validates input, asks the Model to authenticate, and renders either a success View or an error View.

**Flow**:
1. User interacts with the View (clicks button)
2. Controller receives the action
3. Controller updates the Model
4. Model notifies the View (or Controller refreshes the View)
5. User sees updated View

**Benefits**: Parallel development (frontend and backend teams work independently), testability (Model and Controller tested without UI), multiple views for same data (web + mobile + API).

## Real-World Example
A blog app in Django: The \`Post\` class (Model) defines fields and database logic. The HTML template (View) displays blog posts. The \`post_detail\` function (Controller) receives a URL request, fetches the post from the Model, and passes it to the View for rendering.

Modern variants: **MVVM** (Model-View-ViewModel, used in Angular, WPF), **MVP** (Model-View-Presenter), and **MVI** (Model-View-Intent). All share the separation-of-concerns goal.

## Interview Tips
- Know MVC's limitations: "fat controllers" become common anti-patterns
- React is NOT strictly MVC — it's more component-based with unidirectional data flow
- Mention that in modern web, "MVC" is often distributed: frontend handles V and part of C, backend handles M and part of C

## Common Follow-up Questions
1. Difference between MVC and MVVM? (MVVM has a ViewModel that handles UI state binding)
2. Where does business logic belong? (Model — Controllers should stay thin)
3. Is React MVC? (Not strictly — component-based with one-way data flow; Redux reintroduces some MVC concepts)`,

    'Dependency Injection': `## Definition
**Dependency Injection (DI)** is a design pattern where an object's dependencies are provided from outside (injected) rather than created internally. This inverts the control of dependency creation, making code more flexible, testable, and loosely coupled.

## Why It Matters
DI is the core mechanism behind every modern framework (Spring, Angular, NestJS, .NET Core). It's also the practical implementation of SOLID's Dependency Inversion Principle. Mastery of DI signals senior-level thinking.

## Detailed Explanation

**Without DI (tight coupling)**:
\`\`\`
class OrderService {
  constructor() {
    this.db = new MySQLDatabase();  // hard-coded
    this.logger = new FileLogger(); // hard-coded
  }
}
\`\`\`
Problems: Can't swap MySQL for PostgreSQL. Can't mock the DB for unit tests. Can't change logger without editing OrderService.

**With DI (loose coupling)**:
\`\`\`
class OrderService {
  constructor(database, logger) {  // injected from outside
    this.db = database;
    this.logger = logger;
  }
}

// Somewhere else (composition root)
const service = new OrderService(new MySQLDatabase(), new FileLogger());
// Or for testing:
const testService = new OrderService(new MockDatabase(), new MockLogger());
\`\`\`

**Three types of DI**:
1. **Constructor injection** (recommended): Dependencies passed to constructor. Makes dependencies explicit, supports immutability.
2. **Setter injection**: Dependencies set via setter methods. Allows runtime swapping but violates immutability.
3. **Interface injection**: Class implements interface that accepts the dependency. Rare in practice.

**DI Containers** (like Spring, Angular's injector): Frameworks that automatically wire up dependencies based on configuration or annotations. You declare "OrderService needs a Database," and the container figures out how to provide one.

## Real-World Example
Angular uses DI extensively. When you write \`constructor(private http: HttpClient) {}\`, Angular's injector creates/reuses an \`HttpClient\` and injects it. You never \`new HttpClient()\` yourself. This means:
- Unit tests inject a mock \`HttpClient\`
- Different modules can configure different HTTP implementations
- Lifecycle (singleton vs per-request) is managed centrally

## Interview Tips
- Be ready to contrast "new" (tight coupling) with DI (loose coupling) in code
- Know the benefits: testability, flexibility, single responsibility for wiring
- Mention composition root: the one place in your app where dependencies are finally wired together

## Common Follow-up Questions
1. What's IoC (Inversion of Control)? (The broader principle; DI is one implementation)
2. Is DI only for OOP? (No — functional DI via passing functions as arguments)
3. Downsides of DI? (Adds complexity for small apps; container magic hides flow)`,

    'Coupling Cohesion': `## Definition
**Coupling** measures how dependent two modules are on each other — low coupling is good. **Cohesion** measures how focused and related the contents of a single module are — high cohesion is good. Good software design aims for **low coupling, high cohesion**.

## Why It Matters
These two metrics are how senior engineers judge code quality. Most "bad code" complaints boil down to high coupling or low cohesion. Understanding them lets you articulate *why* a design is good or bad.

## Detailed Explanation

**Coupling** (how much one module knows about another):
- **Tight (bad)**: Module A directly uses Module B's internal details. Changing B breaks A. Examples: accessing private fields via reflection, depending on concrete classes instead of interfaces, shared mutable global state.
- **Loose (good)**: Modules communicate through well-defined interfaces. You can swap one module's implementation without touching others. Example: REST APIs — frontend and backend can change independently as long as the contract holds.

**Types of coupling (from tight to loose)**:
1. Content coupling (worst): One module modifies another's internals
2. Common coupling: Modules share global state
3. Control coupling: One module controls another's execution flow
4. Data coupling (good): Modules communicate via parameters
5. Message coupling (best): Modules talk via messages/events

**Cohesion** (how related a module's internal pieces are):
- **Low (bad)**: A \`Utility\` class with \`sendEmail()\`, \`calculateTax()\`, \`rotateImage()\`, \`parseJSON()\` — unrelated methods jumbled together. Hard to name, hard to maintain.
- **High (good)**: A \`TaxCalculator\` class where every method relates to tax calculation. Single, clear purpose.

**Types of cohesion (from low to high)**:
1. Coincidental (worst): Methods grouped randomly
2. Logical: Methods do "similar kinds" of things but aren't truly related
3. Temporal: Methods called around the same time
4. Procedural: Methods follow a sequence
5. Communicational: Methods operate on the same data
6. Sequential: Output of one feeds input of next
7. Functional (best): All methods contribute to one single, well-defined task

## Real-World Example
**Bad (tight coupling, low cohesion)**: A \`UserService\` class that directly queries the database, sends emails, hashes passwords, formats dates, and logs to files. Impossible to test; any change affects many concerns.

**Good (loose coupling, high cohesion)**: Split into \`UserRepository\` (database), \`EmailService\` (email), \`PasswordHasher\` (security), \`DateFormatter\` (utility). \`UserService\` composes these via DI. Each class has one focused purpose; changing the email provider doesn't touch user logic.

## Interview Tips
- Memorize: "Low coupling, high cohesion" — it's the one-liner that works
- Connect to SOLID: Single Responsibility → high cohesion; Dependency Inversion → low coupling
- Be ready to critique code: "This has tight coupling because..."

## Common Follow-up Questions
1. Can you have both extremes? (Perfect cohesion = every class has exactly one method. Too extreme — need balance.)
2. How do you measure coupling? (Count dependencies; static analysis tools like SonarQube do this)
3. Is zero coupling possible? (No — modules must interact somehow; aim for minimal necessary coupling)`,

    'Singleton Deep Dive': `## Definition
Thread-safe **Singleton** patterns ensure exactly one instance of a class exists even when multiple threads try to create it simultaneously. The naive implementation breaks under concurrency, so there are several correct approaches with different trade-offs.

## Why It Matters
Singleton is simple to draw on a whiteboard but tricky to implement correctly. Interviewers use it to test your understanding of concurrency, memory models, and language-specific behaviors.

## Detailed Explanation

**Naive (broken) implementation**:
\`\`\`java
public static Singleton getInstance() {
  if (instance == null) {
    instance = new Singleton(); // race condition!
  }
  return instance;
}
\`\`\`
Problem: Two threads check \`null\` simultaneously, both create instances.

**Approach 1: Synchronized method** (simple but slow):
\`\`\`java
public static synchronized Singleton getInstance() {
  if (instance == null) instance = new Singleton();
  return instance;
}
\`\`\`
Correct but every call takes a lock — performance hit.

**Approach 2: Double-Checked Locking** (fast but subtle):
\`\`\`java
private static volatile Singleton instance; // volatile is critical

public static Singleton getInstance() {
  if (instance == null) {                 // first check (no lock)
    synchronized (Singleton.class) {
      if (instance == null) {              // second check (with lock)
        instance = new Singleton();
      }
    }
  }
  return instance;
}
\`\`\`
The \`volatile\` keyword prevents instruction reordering — without it, a thread might see a partially constructed object. Works in Java 5+.

**Approach 3: Initialization-on-Demand Holder** (elegant, Java):
\`\`\`java
private static class Holder {
  static final Singleton INSTANCE = new Singleton();
}
public static Singleton getInstance() { return Holder.INSTANCE; }
\`\`\`
Leverages class-loading semantics: the Holder class isn't loaded until \`getInstance()\` is called, guaranteed thread-safe by the JVM.

**Approach 4: Enum** (Joshua Bloch's recommendation):
\`\`\`java
public enum Singleton {
  INSTANCE;
  public void doSomething() { ... }
}
\`\`\`
Serialization-safe, reflection-safe, thread-safe. The best approach in Java when applicable.

## Real-World Example
Database connection pools (HikariCP), logging frameworks (Log4j), configuration managers, and caches often use Singleton. In Spring, \`@Singleton\` beans are the default scope — the framework handles instantiation, so you never write this code yourself.

## Interview Tips
- Know why the naive version is broken (race condition)
- Memorize the volatile + double-checked locking pattern for Java
- Mention "Singleton is often an anti-pattern" — earns senior engineer credibility
- Know your language: Python modules are singletons by default; JavaScript uses module patterns

## Common Follow-up Questions
1. Why is \`volatile\` necessary in double-checked locking? (Prevents instruction reordering that could expose a half-built object)
2. What breaks Singleton? (Reflection, serialization, multiple class loaders, cloning)
3. How is Singleton different from static class? (Singleton is an object — can implement interfaces, be passed around; static class is just a namespace)`,

    'Factory vs Abstract Factory': `## Definition
**Factory Method** creates a single product through a method that subclasses can override to change the product type. **Abstract Factory** creates *families of related products* through an interface with multiple factory methods. One creates one thing; the other creates coordinated sets.

## Why It Matters
These two patterns are often confused. Knowing the precise difference shows you understand design pattern nuances — a hallmark of senior engineers.

## Detailed Explanation

**Factory Method**:
\`\`\`
abstract class Dialog {
  abstract Button createButton();  // factory method
  void render() {
    Button btn = createButton();
    btn.onClick(...);
  }
}
class WindowsDialog extends Dialog { Button createButton() { return new WindowsButton(); } }
class MacDialog extends Dialog { Button createButton() { return new MacButton(); } }
\`\`\`
One factory method, one product type. Subclasses decide which variant to produce. Great when you have a workflow (\`render()\`) that's mostly fixed but one object varies.

**Abstract Factory**:
\`\`\`
interface GUIFactory {
  Button createButton();
  Checkbox createCheckbox();
  Dropdown createDropdown();
}
class WindowsFactory implements GUIFactory { ... }  // all Windows components
class MacFactory implements GUIFactory { ... }       // all Mac components
\`\`\`
Multiple factory methods in one interface. Each concrete factory produces a *family* of related products that should work together (all Mac components or all Windows components — never mixed).

**The key distinction**:
- Factory Method: "I need a Button. Subclass decides which."
- Abstract Factory: "I need a matched set of GUI components. Pick one factory, get all of them consistent."

**When to use each**:
- Factory Method: When creation varies for ONE object type
- Abstract Factory: When you need multiple related objects that must come from the same family (cross-platform UI, database drivers with matched connection/statement/result-set classes, rendering engines)

## Real-World Example
**Factory Method**: Java's \`Iterator\` — every collection has a \`createIterator()\` method. \`ArrayList\` returns an ArrayListIterator; \`LinkedList\` returns its own. Same pattern (factory method), different concrete iterators.

**Abstract Factory**: Cross-platform UI toolkits. A \`MacFactory\` produces MacButton, MacCheckbox, MacMenu — all visually consistent. A \`WindowsFactory\` produces the Windows-styled versions. Code using the factory doesn't know which platform it's on — it just asks the factory.

## Interview Tips
- Draw both UML diagrams — the difference is visible (one method vs multiple)
- Give a concrete scenario for each
- Mention that Abstract Factory often uses Factory Methods internally — they compose well
- Know: "Abstract Factory is to Factory Method what a family pack is to a single product"

## Common Follow-up Questions
1. What's the Simple Factory? (Not a GoF pattern — just a static method that creates different types based on input. Good starting point but not as flexible.)
2. When would you prefer Builder over Factory? (When object construction has many optional parameters or complex steps)
3. Can Abstract Factory be implemented without Factory Method? (Yes, but the two often combine for flexibility)`,

    'Builder Pattern': `## Definition
The **Builder Pattern** separates the construction of a complex object from its representation, allowing the same construction process to create different representations. It's especially useful for objects with many optional parameters or complex initialization steps.

## Why It Matters
Builder solves the "telescoping constructor" problem — when you have constructors like \`new Pizza(size, crust, cheese, pepperoni, mushrooms, olives, ...)\` with 10+ parameters. It's also a favorite in fluent APIs.

## Detailed Explanation

**The problem Builder solves**: Complex objects with many optional fields lead to awful constructors:
\`\`\`
new Pizza(12, "thin", true, true, false, true, false, false, "extra sauce");
\`\`\`
You can't tell what's what without checking the signature. Optional parameters force you to pass nulls or defaults.

**Builder solution**:
\`\`\`
Pizza pizza = new Pizza.Builder()
  .size(12)
  .crust("thin")
  .cheese(true)
  .pepperoni(true)
  .olives(true)
  .extraSauce()
  .build();
\`\`\`
Clean, readable, order-independent, easy to extend.

**Structure**:
1. **Product**: The complex object being built (e.g., \`Pizza\`).
2. **Builder**: A separate class (often nested) with methods for each piece and a final \`build()\` method.
3. **Director** (optional): Knows how to use a Builder to construct common configurations. Example: \`PizzaDirector.margherita(builder)\` builds a margherita.

**Two common implementations**:
- **Fluent Builder** (most common): Each method returns \`this\` so calls can chain. Great for readability.
- **Step Builder**: Enforces order — \`sizeStep()\` returns a builder that only has crust methods; \`crustStep()\` returns a builder with topping methods. Prevents incorrect construction.

**Benefits**:
- Immutable objects: \`build()\` creates the final object; no setters on the product
- Parameter validation in one place (\`build()\` can throw if required fields missing)
- Same builder can produce different variants

## Real-World Example
Java's \`StringBuilder\` is a basic builder. More complex: SQL query builders (\`QueryBuilder.select("*").from("users").where("age > ?", 18).orderBy("name").build()\`). Lombok's \`@Builder\` annotation auto-generates builder pattern boilerplate.

HTTP client builders like OkHttp: \`new OkHttpClient.Builder().connectTimeout(10, SECONDS).readTimeout(30, SECONDS).build()\` — tons of optional config, Builder makes it readable.

## Interview Tips
- Distinguish from Factory: Factory creates in ONE call; Builder builds step-by-step
- Mention "telescoping constructor" — shows you know the pain it solves
- Know when NOT to use it: simple objects with 2-3 fields don't need builders (overkill)

## Common Follow-up Questions
1. Builder vs Factory? (Builder: multi-step complex construction. Factory: single method call.)
2. Can you enforce required fields? (Yes — step builders or validation in \`build()\`)
3. What's Joshua Bloch's Builder? (The classic Effective Java version with a static nested Builder class)`,

    'Adapter Pattern': `## Definition
The **Adapter Pattern** allows objects with incompatible interfaces to work together by wrapping one object inside another that translates between the two interfaces. Also called the **Wrapper pattern**.

## Why It Matters
Real codebases constantly integrate with third-party libraries, legacy code, and external APIs — all with different interfaces. Adapter is how you make them play nice without modifying their source. Common in every production codebase.

## Detailed Explanation

**The problem**: You have existing code that expects interface A. You want to use a class that only provides interface B. You can't modify either. Solution: create an Adapter that implements A and internally calls B.

**Structure**:
1. **Target**: The interface your code expects (e.g., \`MediaPlayer\` with \`play(file)\`).
2. **Adaptee**: The existing, incompatible class (e.g., \`VLCPlayer\` with \`playVLC(url, options)\`).
3. **Adapter**: Implements Target and wraps Adaptee, translating calls.

\`\`\`
interface MediaPlayer { void play(String file); }

class VLCPlayer {  // existing, can't modify
  void playVLC(String url, VLCOptions opts) { ... }
}

class VLCAdapter implements MediaPlayer {
  private VLCPlayer vlc = new VLCPlayer();
  public void play(String file) {
    vlc.playVLC(file, new VLCOptions.Default());  // translation
  }
}
\`\`\`

Now any code that uses \`MediaPlayer\` can transparently work with VLC.

**Two variants**:
- **Object Adapter** (composition): Adapter holds a reference to Adaptee. More flexible — can adapt multiple Adaptees.
- **Class Adapter** (multiple inheritance): Adapter extends both Target and Adaptee. Only works in languages with multiple inheritance (C++).

**When to use**:
- Integrating a legacy system with a new codebase
- Using a third-party library whose interface doesn't match yours
- Making old code compatible with new standards without rewriting

## Real-World Example
Java's \`Arrays.asList()\` is an adapter — it converts an array (one interface) to a List (another interface) without copying data.

Real-world example: payment integration. Your system uses a \`PaymentGateway\` interface. You integrate Stripe (has its own SDK with \`Stripe.Charge.create()\`) and Razorpay (has different methods). You write \`StripeAdapter\` and \`RazorpayAdapter\` — both implement \`PaymentGateway\`. Your checkout code doesn't care which is used.

## Interview Tips
- Emphasize "adapter doesn't add new behavior — just translates"
- Distinguish from Decorator (which ADDS behavior to the same interface) and Facade (which simplifies complex subsystems)
- Mention real integration scenarios — interviewers love practical examples

## Common Follow-up Questions
1. Adapter vs Decorator? (Adapter changes interface; Decorator keeps interface and adds behavior)
2. Adapter vs Facade? (Adapter translates one-to-one; Facade simplifies multi-class subsystem)
3. What's a two-way adapter? (Implements both Target and Adaptee interfaces so clients of either can use it)`,

    'Facade Pattern': `## Definition
The **Facade Pattern** provides a simplified, unified interface to a complex subsystem of multiple classes. It hides the subsystem's complexity and gives clients an easy-to-use entry point without preventing direct access to underlying classes when needed.

## Why It Matters
Facade is one of the simplest and most commonly used patterns in real code. Every time you see a library with a "simple API on top of complex internals," that's Facade. It reduces coupling between clients and subsystems dramatically.

## Detailed Explanation

**The problem**: You have a subsystem with 10 classes that must be used in a specific sequence with specific configurations. Every client has to learn all 10 classes. Code duplication everywhere.

**Solution**: Create one Facade class that exposes a few simple methods. The Facade handles the complexity internally. Clients only need to know the Facade.

**Structure**:
1. **Facade**: A single class exposing a simple interface.
2. **Subsystem classes**: Multiple complex classes with many dependencies between them.
3. **Client**: Talks only to the Facade (though direct access to subsystem classes is still allowed for advanced users).

\`\`\`
// Complex subsystem
class VideoDecoder { ... }
class AudioMixer { ... }
class CodecConverter { ... }
class Renderer { ... }

// Facade
class VideoPlayerFacade {
  public void playVideo(String file) {
    decoder.decode(file);
    mixer.mixAudio(...);
    converter.convert(...);
    renderer.render(...);
  }
}

// Client
new VideoPlayerFacade().playVideo("movie.mp4");  // one line!
\`\`\`

**Key properties**:
- Facade doesn't add new functionality — just organizes existing calls
- Clients can still bypass the Facade for custom workflows
- Often implemented as a Singleton when the subsystem is shared
- Frequently used with other patterns (Facade over a set of Strategies, for example)

## Real-World Example
jQuery is essentially a giant Facade over the DOM API. Instead of:
\`\`\`
var elem = document.getElementById("foo");
var handler = function() { ... };
elem.addEventListener("click", handler);
\`\`\`
You get:
\`\`\`
$("#foo").on("click", handler);
\`\`\`
jQuery wraps dozens of inconsistent DOM APIs behind one clean interface.

Other examples: Spring's \`JdbcTemplate\` facades over raw JDBC (connection, statement, result-set management). React Native's navigation libraries facade over platform-specific APIs. AWS SDK's high-level clients facade over low-level REST calls.

## Interview Tips
- Distinguish from Adapter (adapts one incompatible interface) — Facade simplifies MANY classes
- Mention it's often the first pattern to apply when refactoring legacy code
- Know: Facade reduces coupling but can become a "god object" if overused

## Common Follow-up Questions
1. Facade vs Adapter? (Facade simplifies; Adapter translates interfaces)
2. Can clients bypass the Facade? (Yes — Facade doesn't forbid it, just offers convenience)
3. When does Facade become an anti-pattern? (When it grows too large or hides too much, becoming a god class)`,

    'Proxy Pattern': `## Definition
The **Proxy Pattern** provides a placeholder or surrogate for another object to control access to it. The Proxy has the same interface as the real object, so clients can't tell they're using a proxy — but the Proxy can add behavior like caching, access control, lazy loading, or logging.

## Why It Matters
Proxy is everywhere in modern software — ORM lazy loading, security checks, remote procedure calls, caching layers. Understanding it explains "how does Hibernate load related entities only when accessed?" and similar framework magic.

## Detailed Explanation

**Structure**:
1. **Subject interface**: Defines operations (e.g., \`Image.display()\`).
2. **Real Subject**: The actual expensive/sensitive object (\`HighResImage\`).
3. **Proxy**: Implements Subject, holds a reference to Real Subject, adds control logic.

\`\`\`
interface Image { void display(); }

class HighResImage implements Image {  // expensive
  HighResImage(String file) { loadFromDisk(file); }  // slow!
  public void display() { ... }
}

class ImageProxy implements Image {
  private String file;
  private HighResImage realImage;  // lazy
  
  ImageProxy(String file) { this.file = file; }
  public void display() {
    if (realImage == null) realImage = new HighResImage(file);
    realImage.display();
  }
}
\`\`\`

**Common proxy types**:

1. **Virtual Proxy** (lazy loading): Delays expensive object creation until needed. Used in ORMs (Hibernate's lazy-loaded relationships).

2. **Protection Proxy** (access control): Checks permissions before forwarding calls. "Can this user call admin methods?"

3. **Remote Proxy**: Represents an object in a different address space (another machine). RMI, gRPC, and REST clients are remote proxies.

4. **Caching Proxy**: Stores results of expensive operations. First call computes; subsequent calls return cached result.

5. **Smart Proxy**: Adds extra behavior like reference counting, logging, or thread-safety wrappers.

## Real-World Example
**Hibernate lazy loading**: When you fetch a \`User\` entity, its \`orders\` collection isn't actually loaded. Hibernate gives you a proxy. The moment you call \`user.getOrders().size()\`, the proxy fires a SQL query. This is a Virtual Proxy — it looks like a List but intercepts access.

**Spring AOP**: When you annotate a method with \`@Transactional\`, Spring creates a proxy around your class. Calls to that method are intercepted, a transaction is started, your method runs, and the transaction commits/rolls back. All transparent to the caller.

**CDNs** are protection/caching proxies for web servers. The browser talks to the CDN (proxy), which may serve cached content or forward the request to the origin server.

## Interview Tips
- Proxy vs Decorator: Both wrap objects, but Proxy CONTROLS access; Decorator ADDS behavior
- Proxy vs Adapter: Proxy has the SAME interface; Adapter has a DIFFERENT interface
- Know virtual/remote/protection types by name — interviewers love specific terminology
- Mention frameworks that use it (Hibernate, Spring) for credibility

## Common Follow-up Questions
1. How is Proxy different from Decorator? (Proxy controls; Decorator enhances)
2. What's the relationship between Proxy and AOP? (AOP is often implemented via dynamic proxies)
3. Can you write a proxy without inheritance? (Yes — dynamic proxies via reflection, or JavaScript's Proxy object)`,

    'Command Pattern': `## Definition
The **Command Pattern** encapsulates a request as an object, containing all the information needed to perform the action. This allows you to parameterize methods with different requests, queue or log requests, and support undoable operations.

## Why It Matters
Command is the foundation of undo/redo systems, task queues, and transaction logs. Understanding it unlocks advanced features like macro recording, command history, and job scheduling.

## Detailed Explanation

**Structure**:
1. **Command interface**: Declares \`execute()\` (and often \`undo()\`).
2. **Concrete Commands**: Implement execute() by calling methods on a Receiver.
3. **Receiver**: The object that actually does the work.
4. **Invoker**: Triggers commands without knowing their details.
5. **Client**: Creates concrete commands and assigns them to invokers.

\`\`\`
interface Command { void execute(); void undo(); }

class TurnOnLightCommand implements Command {
  private Light light;
  TurnOnLightCommand(Light light) { this.light = light; }
  public void execute() { light.on(); }
  public void undo() { light.off(); }
}

class RemoteControl {  // Invoker
  private Command slot;
  public void setCommand(Command c) { slot = c; }
  public void pressButton() { slot.execute(); }
}
\`\`\`

**Why this is powerful**:
- The RemoteControl (Invoker) doesn't know what commands do — just calls \`execute()\`
- Commands are objects, so they can be stored, queued, logged, passed around
- Undo is trivial: keep a stack of executed commands, pop and call \`undo()\`

**Enabled features**:
- **Undo/Redo**: Stack of executed commands
- **Macros**: List of commands executed in sequence (\`MacroCommand\` = composite)
- **Queueing**: Put commands in a queue for later execution
- **Logging**: Serialize commands to disk; replay after crash
- **Transactions**: Execute all, or undo all

## Real-World Example
**Text editors**: Every keystroke is a command. Ctrl+Z pops the command stack and calls undo(). Ctrl+Y redoes. This is exactly the Command pattern.

**Task queues** like Celery, Sidekiq, or Bull: You enqueue a "job" (really a Command). Workers dequeue and execute. The queue doesn't know what the job does — just that it has an \`execute()\` method.

**Database transactions**: Each SQL statement is effectively a command. The DB maintains a log so it can undo uncommitted changes (rollback).

**Git**: Each commit is essentially a command object. \`git revert\` creates an inverse command.

## Interview Tips
- The killer application: undo/redo — always mention it
- Distinguish from Strategy: Strategy = different algorithms for one task; Command = different tasks
- Know that modern functional programming uses closures for the same effect (command = function)

## Common Follow-up Questions
1. How to implement redo? (Second stack — when you undo, push to redo-stack; when you redo, pop from it)
2. Can commands be serialized? (Yes — enables persistence and distributed execution)
3. What's a MacroCommand? (A Command that executes a list of other Commands — Composite pattern + Command)`,

    'Template Method': `## Definition
The **Template Method Pattern** defines the skeleton of an algorithm in a base class, letting subclasses override specific steps without changing the algorithm's overall structure. The "template" is a fixed method that calls other methods, some of which are abstract.

## Why It Matters
Template Method is the pattern behind most framework extension points. Whenever a framework says "extend this class and override these methods," you're using Template Method. Understanding it unlocks framework design.

## Detailed Explanation

**Structure**:
1. **Abstract class**: Contains the template method (final/non-overridable) and abstract "hook" methods.
2. **Concrete subclasses**: Implement the abstract hooks with specific behavior.

\`\`\`
abstract class DataProcessor {
  // Template method — fixed algorithm
  public final void process() {
    readData();
    validate();     // hook
    transform();    // hook
    saveResults();
  }
  protected void readData() { /* common logic */ }
  protected abstract void validate();
  protected abstract void transform();
  protected void saveResults() { /* common logic */ }
}

class CSVProcessor extends DataProcessor {
  protected void validate() { /* CSV validation */ }
  protected void transform() { /* CSV transformation */ }
}
\`\`\`

**Key idea — "Hollywood Principle"**: "Don't call us, we'll call you." The base class controls the flow and calls subclass methods at specific points. Subclasses don't invoke the algorithm — they just provide steps.

**Three types of methods in Template Method**:
1. **Abstract methods**: Must be implemented by subclasses.
2. **Concrete methods**: Shared by all subclasses (already implemented).
3. **Hook methods**: Optional methods with default empty implementation — subclasses may override if needed.

## Real-World Example
Java's \`HttpServlet\`: The \`service()\` method is a template. It determines the HTTP method and calls \`doGet()\`, \`doPost()\`, \`doPut()\`, etc. You override only the methods you need — the flow is fixed by the framework.

Spring's \`JdbcTemplate\`: The \`execute()\` method handles connection opening, statement preparation, exception handling, and cleanup. You only provide the callback with your actual SQL logic.

React class components: \`componentDidMount\`, \`render\`, \`componentWillUnmount\` are hooks in a template method (the React lifecycle).

## Interview Tips
- Mention "Hollywood Principle" — makes you sound senior
- Distinguish from Strategy: Template Method uses inheritance (compile-time); Strategy uses composition (runtime)
- Know that functional equivalents exist via higher-order functions

## Common Follow-up Questions
1. Template Method vs Strategy? (Inheritance vs composition; one algorithm with variable steps vs interchangeable whole algorithms)
2. Can the template method be overridden? (Should be marked \`final\` to prevent it — core invariant)
3. Downside? (Inheritance-based → rigid; too many hooks becomes confusing)`,

    'State Pattern': `## Definition
The **State Pattern** allows an object to alter its behavior when its internal state changes. The object appears to change its class — you interact with the same object, but its methods behave differently based on the current state.

## Why It Matters
State Pattern eliminates massive switch/if-else chains that check a \`currentState\` variable. It's the clean, object-oriented solution to state machines, which appear in UIs, games, workflows, and protocol handlers.

## Detailed Explanation

**The problem**: An object has different behaviors based on a state variable. Without the pattern, you get sprawling if-else chains in every method that check the current state. Bugs, missed cases, hard to extend.

**Solution — State Pattern**: Each state is a class. Transitions happen by swapping the state object. Adding a new state = adding a class (Open/Closed Principle).

\`\`\`
interface OrderState {
  void ship(Order order);
  void cancel(Order order);
  void deliver(Order order);
}

class PendingState implements OrderState {
  public void ship(Order o) { throw new Error("Can't ship unpaid"); }
  public void cancel(Order o) { o.setState(new CancelledState()); }
}

class PaidState implements OrderState {
  public void ship(Order o) { /* ship */ o.setState(new ShippedState()); }
}

class Order {
  private OrderState state = new PendingState();
  void ship() { state.ship(this); }
  void setState(OrderState s) { state = s; }
}
\`\`\`

**Key benefits**:
- Behavior per state is isolated in its own class
- Adding states doesn't modify existing code
- State transitions are explicit (you can see where states change)
- Eliminates conditional logic

## Real-World Example
**Traffic light**: \`Red\`, \`Yellow\`, \`Green\` states. Each state's \`next()\` method transitions to the next. The traffic light object itself doesn't know the sequence — states encode it.

**TCP connection**: States like \`LISTEN\`, \`SYN_SENT\`, \`ESTABLISHED\`, \`CLOSE_WAIT\`. Each state handles packets differently. Classic state machine territory.

**Game character**: \`Idle\`, \`Running\`, \`Jumping\`, \`Attacking\`. Pressing "jump" does different things depending on state (can't jump while already jumping).

## Interview Tips
- Closely related to **finite state machines** — mention this connection
- Contrast with Strategy: State changes itself (context transitions between states); Strategy is picked externally
- Mention real-world cases: order workflows, game dev, protocol handlers

## Common Follow-up Questions
1. State vs Strategy? (Same structure but different intent — Strategy is client-picked; State self-transitions)
2. Where do transitions live? (Either in the states themselves or in the context — both valid)
3. How to handle invalid transitions? (Throw exception, or use a default "InvalidState" handler)`,

    'Iterator Pattern': `## Definition
The **Iterator Pattern** provides a way to access elements of a collection sequentially without exposing its underlying representation. The client uses a uniform \`hasNext()\`/\`next()\` interface regardless of whether the collection is an array, linked list, tree, or database cursor.

## Why It Matters
Iterator is so fundamental it's built into nearly every modern language (Java's Iterable, Python's __iter__, JavaScript's Symbol.iterator). Understanding it explains \`for-each\` loops, streams, generators, and lazy evaluation.

## Detailed Explanation

**Structure**:
1. **Iterator interface**: Defines \`hasNext()\` and \`next()\`.
2. **Concrete Iterator**: Tracks current position in the collection.
3. **Aggregate interface**: Collection that provides an iterator (\`createIterator()\`).
4. **Concrete Aggregate**: The actual collection class.

**Why it's powerful**:
- Uniform access: same loop code works for lists, trees, graphs
- Multiple iterators: you can have several cursors on the same collection simultaneously
- Lazy evaluation: iterators can produce values on demand (infinite sequences!)
- Encapsulation: you don't need to know HOW the collection stores data

**Types of iterators**:
- **External iterator** (most common): Client controls iteration (\`while (it.hasNext()) ...\`).
- **Internal iterator**: Collection controls iteration (\`list.forEach(fn)\`). More concise, less flexible.
- **Lazy iterator**: Computes elements only when requested — enables infinite sequences.

## Real-World Example
**Java Streams**: \`list.stream().filter(x -> x > 10).map(x -> x*2)\` returns iterators, not computed values. The chain is lazy — nothing happens until you call \`.collect()\` or \`.forEach()\`.

**Python generators**: An infinite sequence via \`yield\` — you only pay for what you consume.

**Database cursors**: You don't load 1 million rows into memory — you iterate one at a time with a cursor. Classic iterator pattern.

## Interview Tips
- Mention fail-fast iterators (Java's throw ConcurrentModificationException if you modify a collection during iteration)
- Know the trade-off: external iterators are flexible; internal iterators are safer but less flexible
- Connect to functional concepts: map/filter/reduce are abstractions over iteration

## Common Follow-up Questions
1. What's a fail-fast iterator? (Detects modification during iteration and throws)
2. How do lazy iterators save memory? (Don't materialize the full collection)
3. What happens if you call \`next()\` when \`hasNext()\` is false? (Throws NoSuchElementException in Java)`,

    'Chain of Responsibility': `## Definition
The **Chain of Responsibility Pattern** passes a request along a chain of handlers. Each handler decides either to process the request or pass it to the next handler in the chain. The sender doesn't know which handler will ultimately handle it.

## Why It Matters
This pattern powers middleware systems — Express.js, ASP.NET, servlet filters, logging pipelines. Understanding it unlocks how web frameworks handle requests.

## Detailed Explanation

**Structure**:
1. **Handler interface**: Defines \`handleRequest()\` and a reference to the next handler.
2. **Concrete Handlers**: Each checks if it can handle the request; if not, passes it along.
3. **Client**: Builds the chain and sends the request to the first handler.

\`\`\`
abstract class Logger {
  protected Logger next;
  public Logger setNext(Logger next) { this.next = next; return next; }
  public void log(String msg, int level) {
    if (canHandle(level)) write(msg);
    if (next != null) next.log(msg, level);  // pass along
  }
  abstract boolean canHandle(int level);
  abstract void write(String msg);
}
\`\`\`

**Variants**:
- **Pure chain**: Only one handler processes; the rest skip.
- **Cumulative chain**: Every handler that can process does (like the logger above).
- **Short-circuit chain**: Processing stops at the first handler (exception handlers).

**Benefits**:
- Sender decoupled from receivers
- Easy to add/remove/reorder handlers without modifying the client
- Handlers can be reused in different chains

## Real-World Example
**Express.js middleware**: Each \`app.use(fn)\` adds a handler to the chain. When a request arrives, it flows through: auth middleware → logging middleware → rate limiter → route handler → error handler. Each middleware calls \`next()\` to pass it along or sends a response to short-circuit.

**Java Servlet Filters**: Same pattern. Filters for authentication, compression, caching are chained.

**Exception handling in programming languages**: An exception bubbles up through catch blocks — each catch is a handler that either matches and handles, or re-throws (passes up the chain).

**DOM event propagation**: Events bubble up the DOM tree — each parent element can handle or let it continue.

## Interview Tips
- The canonical example is logging with different severity levels
- Compare to Observer: Observer broadcasts to ALL; Chain goes sequentially, may stop
- Mention middleware architectures — this is where it shines in practice

## Common Follow-up Questions
1. What if no handler handles the request? (Either silently drop, or have a default/fallback handler at the end)
2. Can handlers modify the request? (Yes — common in middleware chains)
3. Chain vs Command? (Command is one task encapsulated; Chain is multiple handlers for one request)`,

    'What is Polymorphism': `## Definition
**Polymorphism** means "many forms" — the ability of a single interface, method, or operator to behave differently depending on the underlying object type. It allows you to write code that works with abstract types and have it automatically handle the specific types at runtime.

## Why It Matters
Polymorphism is what makes OOP flexible. Without it, you'd need different code paths for every concrete class. With it, one function works with any subtype — the heart of plug-and-play design.

## Detailed Explanation

**Two main types**:

**1. Compile-time polymorphism (static)** — **Method Overloading**:
Multiple methods with the same name but different parameter types or counts. The compiler picks the right one based on the arguments.
\`\`\`
int add(int a, int b) { return a + b; }
double add(double a, double b) { return a + b; }
String add(String a, String b) { return a + b; }
\`\`\`

**2. Runtime polymorphism (dynamic)** — **Method Overriding**:
A subclass provides a specific implementation of a method defined in the parent class. At runtime, the actual object's method is called (dynamic dispatch), not the declared type's.
\`\`\`
class Animal { void makeSound() { print("generic sound"); } }
class Dog extends Animal { void makeSound() { print("Woof"); } }
class Cat extends Animal { void makeSound() { print("Meow"); } }

Animal a = new Dog();
a.makeSound();  // prints "Woof" — runtime decides based on actual object
\`\`\`

**Other forms**:
- **Parametric polymorphism** (generics/templates): \`List<T>\` works for any T
- **Ad-hoc polymorphism**: Operator overloading (\`+\` works for int, double, String)
- **Subtype polymorphism**: Same as runtime polymorphism

**Why it's powerful**:
- Write code for abstract types: works for any subtype
- Add new subclasses without modifying existing code
- Enables patterns like Strategy, Template Method, and Observer

## Real-World Example
Collections framework in Java: \`List<String> list = new ArrayList<>();\` — \`list\` is declared as List but is actually ArrayList. Calling \`list.add("x")\` dispatches to ArrayList's implementation. Swap for LinkedList, code doesn't change.

Payment processing: \`processPayment(Payment p)\` accepts any Payment subtype (CreditCard, UPI, PayPal). Each has its own \`process()\` method. The caller doesn't care which type it is — polymorphism handles it.

## Interview Tips
- Always distinguish runtime (overriding) from compile-time (overloading)
- Runtime polymorphism is THE interview answer — overloading is secondary
- Mention "dynamic dispatch" — the mechanism behind runtime polymorphism
- Relate to Liskov Substitution Principle

## Common Follow-up Questions
1. How does the JVM implement runtime polymorphism? (Virtual method table / vtable)
2. Can static methods be overridden? (No — they can be hidden, which is different)
3. Overloading vs overriding? (Same class different signatures vs parent/child same signature)`,

    'Overloading vs Overriding': `## Definition
**Method Overloading** defines multiple methods with the same name but different parameters within the SAME class — resolved at compile time. **Method Overriding** provides a new implementation in a SUBCLASS for a method already defined in the parent — resolved at runtime.

## Why It Matters
Mixing these up is the fastest way to fail an OOP interview. This is a foundational distinction between static (compile-time) and dynamic (runtime) polymorphism.

## Detailed Explanation

**Overloading** — same name, different signatures, same class:
\`\`\`
class Calculator {
  int add(int a, int b) { return a + b; }
  double add(double a, double b) { return a + b; }
  int add(int a, int b, int c) { return a + b + c; }
}
\`\`\`
The compiler decides which method to call based on the argument types/count. Zero runtime overhead — resolved before your program runs.

**Overriding** — same name, same signature, subclass:
\`\`\`
class Vehicle {
  void start() { print("Generic start"); }
}
class Car extends Vehicle {
  @Override
  void start() { print("Car engine starts"); }
}

Vehicle v = new Car();
v.start();  // prints "Car engine starts" — resolved at runtime
\`\`\`

**Comparison table**:

| Feature | Overloading | Overriding |
|---------|-------------|------------|
| Scope | Same class | Parent + child class |
| Signature | Must differ | Must be identical |
| Return type | Can differ | Must be same or covariant |
| Access modifier | Can differ | Cannot be more restrictive |
| Resolved at | Compile time | Runtime |
| Static methods | Can be overloaded | Cannot be overridden (hidden) |
| Private methods | Can be overloaded | Cannot be overridden |
| Final methods | Can be overloaded | Cannot be overridden |
| Polymorphism type | Static/compile-time | Dynamic/runtime |

**Common rules for overriding (Java)**:
- Method signature must match exactly
- Return type must be same or a subtype (covariant return)
- Cannot throw new/broader checked exceptions
- Access level cannot be more restrictive (public → private is invalid)
- Use \`@Override\` annotation to catch mistakes

## Real-World Example
**Overloading**: \`System.out.println()\` — overloaded for every primitive type and String. Compiler picks the right one.

**Overriding**: \`Object.toString()\` — every class inherits it, most override it. When you \`println(myObject)\`, Java calls the overridden \`toString()\` at runtime.

## Interview Tips
- Always state: "Overloading is compile-time; overriding is runtime"
- Know the rules for overriding (access, exceptions, return type)
- Mention \`@Override\` annotation — interviewer-appealing detail
- Be ready to identify which is which given a code snippet

## Common Follow-up Questions
1. Can you overload based on return type alone? (No — ambiguous)
2. Can constructors be overloaded? (Yes, common. Overridden? No — constructors are not inherited)
3. What's method hiding? (Static method with same signature in subclass — not overriding)`,

    'What is Encapsulation': `## Definition
**Encapsulation** is the bundling of data (fields) and the methods that operate on that data into a single unit (a class), while restricting direct access to some components. It protects an object's internal state from unintended external modification.

## Why It Matters
Encapsulation is the "safety" pillar of OOP. It prevents bugs caused by external code putting objects into invalid states, enables safe refactoring, and is essential for building maintainable large systems.

## Detailed Explanation

**Two aspects**:
1. **Bundling**: Data and behavior that work together live in the same class.
2. **Information hiding**: Internal details are hidden; only a controlled interface is exposed.

**Mechanism — Access modifiers**:
- \`private\`: Accessible only within the class
- \`protected\`: Accessible in class and subclasses
- \`public\`: Accessible anywhere
- \`default/package\` (Java): Accessible within the same package

**Typical pattern**:
\`\`\`
class BankAccount {
  private double balance;  // hidden state
  
  public void deposit(double amount) {
    if (amount <= 0) throw new Error("Invalid amount");
    balance += amount;
  }
  
  public double getBalance() { return balance; }
  // No public setter — balance can only change via deposit/withdraw
}
\`\`\`

Without encapsulation, external code could set \`account.balance = -1000\` and break everything. With encapsulation, the class enforces rules.

**Benefits**:
- **Invariants**: The class guarantees valid state at all times
- **Refactoring freedom**: Change internal representation without breaking clients
- **Reduced bugs**: Fewer entry points = fewer ways to break things
- **Better APIs**: Expose only what clients need
- **Easier testing**: Well-encapsulated classes have clear inputs and outputs

**Common misconception**: Encapsulation is NOT the same as "just using getters and setters." Blindly adding getters/setters for every field defeats encapsulation — you've just exposed state with extra steps. Real encapsulation means thinking about which operations clients actually need and exposing only those.

## Real-World Example
**Java's ArrayList**: The internal array \`elementData\` is private. You can't directly access or modify it. You interact via \`add()\`, \`remove()\`, \`get()\`. This allows ArrayList to resize the internal array, maintain size, check bounds — all behind the scenes.

**Bank account systems**: Balance is never exposed for direct modification. All changes go through \`deposit()\`, \`withdraw()\`, or \`transfer()\` methods, which validate, log, and audit each change.

**Database connection objects**: Internal connection state (socket, credentials) is hidden. You use \`execute(query)\`, \`commit()\`, \`rollback()\`. The client doesn't need to know (or mess with) how the connection works.

## Interview Tips
- Distinguish from abstraction: encapsulation hides DATA; abstraction hides COMPLEXITY
- Don't confuse with just "getters and setters" — real encapsulation is about invariants
- Mention "tell, don't ask" principle: prefer \`account.deposit(100)\` over \`account.setBalance(account.getBalance() + 100)\`

## Common Follow-up Questions
1. Encapsulation vs Abstraction? (Data hiding vs complexity hiding)
2. Is exposing a public field ever OK? (Final immutable fields are acceptable)
3. How does encapsulation help with multithreading? (Internal state can be protected with locks without clients interfering)`,

    'What is Abstraction': `## Definition
**Abstraction** is the concept of exposing only essential features and hiding implementation complexity. It means showing WHAT an object does without revealing HOW it does it. Clients interact with a simple, stable interface while the underlying implementation can be arbitrarily complex.

## Why It Matters
Abstraction is the key to managing complexity in large systems. Every useful API, library, and framework exists because of abstraction. Without it, you'd need to understand every detail of every component you use.

## Detailed Explanation

**Achieved through**:
1. **Abstract classes**: Can have both implemented and abstract methods; subclasses fill in the abstract parts.
2. **Interfaces**: Pure contracts — a list of methods clients can call with no implementation details.
3. **Modules/packages**: Group related functionality, expose a limited public API.

**Example**:
\`\`\`
interface List<T> {
  void add(T item);
  T get(int index);
  int size();
}

// Clients write:
List<String> names = new ArrayList<>();
names.add("Alice");
\`\`\`

The client uses the List abstraction. Whether it's an ArrayList (array-backed), LinkedList (node-backed), or CopyOnWriteArrayList (thread-safe) — the code works identically. The client doesn't know or care about the implementation.

**Levels of abstraction**:
- **Low-level**: Closer to hardware (bits, bytes, memory addresses)
- **High-level**: Closer to the problem domain (Customer, Order, Invoice)

Good software layers abstractions — high-level code uses mid-level abstractions which use low-level abstractions. Each layer hides the one below.

**Abstraction vs Encapsulation** (classic interview trap):
- **Abstraction**: Design-level concept — deciding what to show and what to hide
- **Encapsulation**: Implementation-level concept — mechanism (private fields, access modifiers) to enforce abstraction
- Abstraction is about "what"; encapsulation is about "how to enforce what"

Another way: abstraction is the decision; encapsulation is the enforcement.

## Real-World Example
**Driving a car**: You interact with abstractions — steering wheel, pedals, gear shift. You don't need to understand fuel injection, transmission gears, or electronic control units. The car abstracts away the mechanical complexity.

**Programming**: When you call \`database.query("SELECT * FROM users")\`, a massive amount of complexity is hidden — connection pooling, socket communication, protocol parsing, result buffering. You interact with a simple method.

**HTTP**: REST APIs abstract network details. You call \`GET /users/123\` — hidden underneath: TCP handshake, TLS encryption, HTTP parsing, routing, database queries, serialization.

## Interview Tips
- Always distinguish from encapsulation — this is the #1 follow-up question
- Mention real-world analogies (car, TV remote, ATM)
- Know that abstraction can be at multiple levels (function, class, module, service)

## Common Follow-up Questions
1. Abstraction vs Encapsulation? (What to hide vs how to hide)
2. Can you have abstraction without OOP? (Yes — functions, modules, APIs all abstract)
3. What's leaky abstraction? (When implementation details leak through the interface, forcing clients to know about them — bad design)`,

    'Access Modifiers': `## Definition
**Access modifiers** are keywords that control the visibility and accessibility of classes, methods, and fields. They enforce encapsulation by defining which code can access which members of a class.

## Why It Matters
Using the wrong access modifier is a common source of bugs and poor design. Understanding each modifier's scope is essential for proper encapsulation and API design.

## Detailed Explanation

**Java's four access levels** (most restrictive to least):

**1. \`private\`**: Accessible only within the declaring class.
- Use for: implementation details, internal state, helper methods
- Default choice for fields

**2. \`default\` (package-private)**: No keyword — accessible within the same package only.
- Use for: classes/members shared across a package but hidden from outside
- Often overlooked but useful for internal module structure

**3. \`protected\`**: Accessible within the same package AND in subclasses (even in different packages).
- Use for: methods meant to be overridden, fields subclasses need to access

**4. \`public\`**: Accessible from anywhere.
- Use for: the class's intentional API surface
- Be cautious — public is a contract you're stuck with

**Language differences**:
- **Python**: No true access modifiers — convention-based: \`_name\` (protected, by convention), \`__name\` (name-mangled "private")
- **C++**: \`public\`, \`protected\`, \`private\` — but no package concept
- **C#**: Adds \`internal\` (assembly-private) and \`protected internal\` (assembly OR subclass)
- **JavaScript**: Traditionally no modifiers; ES2022 added \`#private\` fields

**Access modifier best practices**:
- Default to \`private\` — open up only when necessary
- Make fields private, expose via methods
- Prefer \`protected\` over \`public\` for methods meant for subclasses only
- Public API should be minimal and stable — think carefully before making things public

**Visibility table (Java)**:

| Modifier | Same Class | Same Package | Subclass (diff pkg) | Anywhere |
|----------|-----------|--------------|---------------------|----------|
| private | ✅ | ❌ | ❌ | ❌ |
| default | ✅ | ✅ | ❌ | ❌ |
| protected | ✅ | ✅ | ✅ | ❌ |
| public | ✅ | ✅ | ✅ | ✅ |

## Real-World Example
**Java's \`ArrayList\`**: \`elementData\` (the internal array) is \`transient\` and \`package-private\`. \`size()\`, \`add()\`, \`get()\` are public. Helper methods like \`grow()\` are private. This layering exposes a clean API while keeping internals modifiable for performance.

**Framework design**: Spring marks lifecycle methods \`protected\` so subclasses can override them, but regular client code can't invoke them directly.

## Interview Tips
- Know each modifier's exact scope — this is a precision question
- Mention best practice: default to most restrictive
- Know your language's specifics (Python has no real enforcement; JS recently added proper private)

## Common Follow-up Questions
1. Why does Java need both \`default\` and \`protected\`? (Different scopes — package vs inheritance)
2. What's the difference between \`private\` methods and \`final\` methods? (Access vs overridability — private is inaccessible; final is visible but not overridable)
3. Can a top-level class be private? (No — top-level classes can only be public or package-private in Java)`,

    'Class vs Object': `## Definition
A **class** is a blueprint or template that defines the structure and behavior of objects. An **object** is an instance of a class — a concrete entity created from the blueprint, with its own state and the ability to perform the behaviors defined by the class.

## Why It Matters
This is the most basic OOP concept — but interviewers still ask it to test foundational understanding. A confused answer here suggests weak fundamentals.

## Detailed Explanation

**Class = definition**:
A class describes:
- Fields (data/state an object will have)
- Methods (operations the object can perform)
- Constructors (how to initialize)
- Nothing tangible exists yet — just a specification

\`\`\`
class Dog {
  String name;
  int age;
  void bark() { print("Woof"); }
}
\`\`\`

**Object = instance**:
An object is what you get when you use the class blueprint to create a real thing in memory.
\`\`\`
Dog d1 = new Dog();
d1.name = "Buddy";
d1.age = 3;

Dog d2 = new Dog();
d2.name = "Max";
d2.age = 5;
\`\`\`

\`d1\` and \`d2\` are both Dog objects — they share the same blueprint (same methods, same field names) but have their own independent state.

**Analogy**: A blueprint of a house is the class; each built house is an object. The blueprint is intangible and singular; many houses can be built from one blueprint, each with its own color, furniture, and occupants.

**Key distinctions**:

| Aspect | Class | Object |
|--------|-------|--------|
| Nature | Template/definition | Instance/real entity |
| Memory | No memory at runtime (metadata only) | Allocated in heap |
| Count | Typically one definition | Many instances can exist |
| State | No state — just specifies structure | Has actual values |
| Creation | Defined in source code | Created at runtime via \`new\` |

**Advanced concepts**:
- **Static members**: Belong to the class itself, not to instances. Shared across all objects.
- **Instance members**: Belong to each object individually.
- **Class object** (Java): Even classes are objects of type \`Class\` — enables reflection.
- **Metaclass** (Python): Classes are instances of metaclasses.

## Real-World Example
**Cookie cutter (class) vs cookies (objects)**: The cutter defines the shape — star, heart, circle. Each cookie is an object with the same shape but can have different frosting, size, or decorations. You can make as many cookies as you want from one cutter.

**In a banking app**: \`Account\` is a class. \`account1 = new Account("Alice", 1000)\` and \`account2 = new Account("Bob", 500)\` are two objects — same structure, different data.

## Interview Tips
- State it simply: "Class is the blueprint; object is the instance"
- Have an analogy ready (cookie cutter, house blueprint, template)
- Mention that \`new\` creates the object; the class itself doesn't allocate memory

## Common Follow-up Questions
1. Can you have a class without objects? (Yes — abstract classes can't be instantiated; utility classes with only static methods)
2. What's a static class? (In Java, nested static class — not needing outer instance. In C#, all-static class.)
3. What's an anonymous class? (A class defined and instantiated at the same place, often for one-off use)`,

    'Constructor Destructor': `## Definition
A **constructor** is a special method automatically called when an object is created — its job is to initialize the object's state. A **destructor** is a method called when an object is destroyed — its job is to release resources. Not all languages have explicit destructors; many use garbage collection or alternative mechanisms.

## Why It Matters
Resource management (memory, file handles, network connections) is a top source of bugs. Understanding construction and destruction is essential for writing programs that don't leak resources or crash on shutdown.

## Detailed Explanation

**Constructor responsibilities**:
- Initialize all fields to valid states
- Validate input parameters
- Acquire resources the object needs
- Establish class invariants

**Constructor features**:
- Same name as the class
- No return type (not even \`void\`)
- Can be overloaded (multiple constructors with different signatures)
- Can call other constructors (\`this(...)\` in Java, \`: this()\` in C#)
- Can call parent constructor (\`super(...)\`)

\`\`\`
class User {
  private String name;
  private String email;
  
  public User(String name, String email) {
    if (name == null) throw new IllegalArgumentException();
    this.name = name;
    this.email = email;
  }
  
  public User(String name) { this(name, "unknown@example.com"); }  // constructor chaining
}
\`\`\`

**Types of constructors**:
- **Default constructor**: No-argument constructor. Compiler adds one automatically if you define none.
- **Parameterized constructor**: Takes arguments to initialize fields.
- **Copy constructor**: Creates a new object as a copy of an existing one (C++, common pattern in Java).
- **Private constructor**: Prevents instantiation from outside — used in Singleton, utility classes, factory methods.

**Destructor / Cleanup mechanisms**:

**C++ destructor** (\`~ClassName()\`): Called deterministically when object goes out of scope. Freed memory, closed files, released locks. Symmetric with constructor.

**Java finalize()** (deprecated since Java 9): Historical mechanism, unreliable — GC might never call it. Don't use for cleanup.

**Java try-with-resources**: Modern approach. Any class implementing \`AutoCloseable\` can be used with try-with-resources. \`close()\` is called deterministically.
\`\`\`
try (FileReader fr = new FileReader("data.txt")) {
  // use fr
}  // fr.close() automatically called here
\`\`\`

**C# IDisposable + using statement**: Same concept as Java's try-with-resources.

**Python __del__**: Similar to Java finalize — unreliable. Better: context managers (\`with\` statement + \`__enter__\`/\`__exit__\`).

**Garbage collection vs explicit destruction**:
- GC languages (Java, C#, Python, JS): Memory automatically freed — but non-memory resources (files, sockets) need explicit cleanup
- Non-GC languages (C, C++, Rust): Manual memory management (C/C++), or ownership-based (Rust)

## Real-World Example
**File handling**: A \`FileReader\` constructor opens the file. Without destructor or close(), the file stays open — resource leak. Using try-with-resources ensures close() is called even on exceptions.

**Database connections**: Constructor gets connection from pool. Destruction returns it. Failing to release = pool exhaustion = production incident.

## Interview Tips
- Know the difference between memory cleanup (GC) and resource cleanup (explicit)
- Mention RAII (Resource Acquisition Is Initialization) for C++ — strong keyword
- For Java, always recommend try-with-resources, never finalize()

## Common Follow-up Questions
1. Why is Java's finalize deprecated? (Unpredictable, may never run, performance issues)
2. Can constructors be virtual? (In C++ no — object type isn't known during construction)
3. What happens if a constructor throws an exception? (Object is not fully created; any acquired resources must be released before throwing)`,

    'Static vs Instance': `## Definition
**Static members** (methods/fields) belong to the CLASS itself — shared across all instances, accessed via the class name. **Instance members** belong to each individual OBJECT — each instance has its own copy, accessed via the object reference.

## Why It Matters
Misusing static leads to hard-to-test, tightly coupled code. Understanding when to use each is fundamental for good OOP design.

## Detailed Explanation

**Static members**:
- Exist once per class, regardless of how many objects are created
- Accessed via class name: \`Math.PI\`, \`Integer.parseInt()\`
- Initialized when the class is first loaded
- Cannot access instance members directly (no \`this\` reference)
- Useful for utility functions, constants, and class-wide state

\`\`\`
class Counter {
  static int totalCount = 0;  // shared
  int myId;                    // per instance
  
  Counter() {
    totalCount++;              // increments shared counter
    myId = totalCount;         // captures current value
  }
}

Counter a = new Counter();  // totalCount=1, a.myId=1
Counter b = new Counter();  // totalCount=2, b.myId=2, a.myId still 1
\`\`\`

**Instance members**:
- Each object has its own copy
- Accessed via object reference: \`user.name\`, \`list.size()\`
- Have access to \`this\` — the current object
- Can access both instance and static members

**Comparison table**:

| Aspect | Static | Instance |
|--------|--------|----------|
| Belongs to | Class | Object |
| Memory | One copy | One per object |
| Access | ClassName.member | object.member |
| \`this\` keyword | Not available | Available |
| Can access instance members | No (not directly) | Yes |
| Can access static members | Yes | Yes |
| Initialized when | Class loads | Object created |
| Overriding | Hidden (not overridden) | Overridden |

**When to use static**:
- **Utility functions**: Pure functions with no state (\`Math.abs()\`, \`Collections.sort()\`)
- **Constants**: \`public static final double PI = 3.14159\`
- **Factory methods**: \`List.of()\`, \`Integer.valueOf()\`
- **Counters**: Class-wide count (like the example above)
- **Singletons**: The \`getInstance()\` method

**When NOT to use static**:
- When behavior depends on object state
- When you want polymorphism (static methods can't be overridden properly)
- When you need testability (hard to mock static methods)

**Common mistake — overuse of static**: Beginners often make methods static because "they don't need an object." But if the method's behavior could vary by configuration, injection, or context, it should be an instance method — otherwise you've locked yourself into global behavior.

## Real-World Example
**\`Math\` class**: All methods (\`Math.sqrt\`, \`Math.max\`) are static because math operations don't depend on any state. You never do \`new Math()\`.

**\`ArrayList\`**: Almost all methods are instance methods — they operate on the specific list's contents. \`list.add()\` only makes sense on a specific list.

**Singletons**: \`Database.getInstance()\` is static (to access the singleton), but the returned object has instance methods.

## Interview Tips
- Emphasize: "Static is per class, instance is per object"
- Know the testability issue: static methods are hard to mock
- Mention that Java interface default methods can't be static (but static methods ARE allowed in interfaces since Java 8)

## Common Follow-up Questions
1. Can static methods be overridden? (No — they're hidden, not overridden. Calling on subclass still invokes the parent's)
2. Why are static methods hard to test? (Can't mock them with standard mocking frameworks; create global coupling)
3. Can a class have static inner class? (Yes — doesn't need outer instance, like Builder classes)`,

    'Diamond Problem': `## Definition
The **Diamond Problem** is an ambiguity that arises in multiple inheritance when a class inherits from two classes that both inherit from a common ancestor. If the grandparent has a method, and both parents override it differently, it's unclear which version the grandchild should inherit.

## Why It Matters
This is why Java forbids multiple class inheritance. Understanding the Diamond Problem explains Java's design and the workarounds (interfaces, composition) that modern languages use.

## Detailed Explanation

**The classic diamond**:
\`\`\`
       Animal
       (eat)
      /      \\
    Bird     Fish
   (eat)    (eat)     <-- both override eat()
      \\      /
       FlyingFish     <-- which eat() does it inherit?
\`\`\`

If FlyingFish calls \`eat()\`, which implementation runs? Bird's or Fish's? The compiler can't decide — ambiguous. Additionally, if Animal has a field, does FlyingFish have one copy (shared) or two (one per parent)? Even more confusing.

**Language-specific solutions**:

**Java — forbid multiple class inheritance**: A class can extend only one class. Sidesteps the problem entirely. Multiple interface inheritance is allowed because interfaces (pre-Java 8) had no implementation — no conflict possible.

**Java 8+ default methods** — partial diamond: Interfaces can now have default methods. If two interfaces have conflicting default methods, the class must override explicitly.

**C++ — virtual inheritance**: Allows multiple inheritance but uses \`virtual\` keyword to ensure only one copy of the grandparent's fields exists. Programmer must specify which parent's method to call.

**Python — Method Resolution Order (MRO)**: Uses the C3 linearization algorithm to determine a single inheritance order. You can inspect it with \`ClassName.__mro__\`. Deterministic but can be surprising.

**C#** — like Java: single class inheritance, multiple interface inheritance.

**Key takeaway**: Multiple inheritance of state (fields) is universally problematic. Multiple inheritance of interfaces (contracts) is safe because there's no implementation to conflict.

## Real-World Example
**GUI frameworks** historically faced this. An \`EditableScrollableList\` might want to inherit from \`EditableList\` and \`ScrollableList\`, both of which inherit from \`List\`. Modern frameworks solve this via:
- Composition (the list HAS an editor and a scroller)
- Interfaces + mixins (JavaScript, Python)
- Traits (Scala, Rust) — composable bundles of methods

## Interview Tips
- Draw the diamond on the whiteboard — it's visually intuitive
- Mention "this is why Java forbids multiple class inheritance"
- Know your language's specific approach (Java/C# forbid; C++ allows with virtual; Python uses MRO)

## Common Follow-up Questions
1. Why does Java allow multiple interface inheritance? (Pre-Java 8, no implementation conflict possible)
2. What's a mixin? (A class meant to be combined with others to add specific behavior — composition-style multiple inheritance)
3. How does Python's MRO work? (C3 linearization — deterministic order respecting parent ordering)`,

    'Duck Typing': `## Definition
**Duck Typing** is a type philosophy used in dynamically-typed languages where an object's suitability is determined by whether it has the methods and properties needed — not by its declared class or interface. Named after the phrase: "If it walks like a duck and quacks like a duck, it's a duck."

## Why It Matters
Duck typing is fundamental to Python, Ruby, JavaScript, and dynamic languages in general. It enables flexibility and rapid development but trades off compile-time safety. Understanding it is essential for reading and writing idiomatic code in these languages.

## Detailed Explanation

**Static typing approach** (Java, C++, C#):
\`\`\`
void makeNoise(Animal animal) {  // must be Animal type
  animal.makeSound();
}
\`\`\`
Compiler checks: Is the argument an Animal? Does Animal have \`makeSound()\`? If no, error at compile time.

**Duck typing approach** (Python, Ruby, JS):
\`\`\`python
def make_noise(thing):
  thing.make_sound()  # just try to call it
\`\`\`
No type declaration. Python calls \`make_sound()\`. If the object has it, works. If not, runtime error.

**Benefits**:
- **Flexibility**: No need for elaborate type hierarchies
- **Less boilerplate**: No interfaces to define, no inheritance trees
- **Easy testing**: Mock objects don't need to inherit from real classes — just need the right methods
- **Rapid prototyping**: Change types without refactoring inheritance

**Drawbacks**:
- **No compile-time safety**: Errors surface only at runtime
- **Harder to refactor**: IDE can't find all callers safely
- **Documentation burden**: Must document expected "shape" clearly
- **Runtime performance**: Type checks happen every call

**Modern evolution — Structural typing and type hints**:
- TypeScript uses **structural typing**: "If object X has all fields/methods of type T, it IS a T" — formalizes duck typing with static checks
- Python's **type hints** + \`typing.Protocol\` support duck typing WITH static analysis via tools like mypy
- Go interfaces use structural typing: no \`implements\` keyword needed

**Duck typing vs interfaces**:
- **Interface (nominal typing)**: "You must declare that you implement this interface"
- **Duck typing (structural)**: "You just need the right methods — no declaration needed"

## Real-World Example
**Python file-like objects**: Functions that "take a file" really mean "take anything with \`read()\` and \`write()\` methods." You can pass a real file, a StringIO, a BytesIO, a network socket wrapper, or your custom class.

**JavaScript iterables**: The \`for...of\` loop works with anything that implements the iterable protocol (has a \`Symbol.iterator\` method). Arrays, strings, maps, sets, generators, custom classes — all work if they have the right shape.

## Interview Tips
- Know the origin: "walks like a duck, quacks like a duck, it's a duck"
- Mention structural typing (TypeScript, Go) as the modern, statically-checked version
- Discuss trade-offs: flexibility vs safety

## Common Follow-up Questions
1. Duck typing vs interfaces? (Implicit vs explicit declaration)
2. How does TypeScript handle this? (Structural typing — shape matters, not name)
3. What's the risk of duck typing? (Runtime errors that static typing would catch)`,

    'Liskov Substitution': `## Definition
The **Liskov Substitution Principle (LSP)** — the "L" in SOLID — states that objects of a superclass should be replaceable with objects of its subclasses without breaking the correctness of the program. A subclass must be a genuine specialization that fulfills all the expectations set by the parent class.

## Why It Matters
LSP is the principle most commonly violated in practice, often inadvertently. Violations cause subtle bugs: code that works for the parent type fails mysteriously when given a subclass. Understanding LSP makes you design better inheritance hierarchies.

## Detailed Explanation

**Formal statement** (Barbara Liskov, 1987): If S is a subtype of T, then objects of type T may be replaced with objects of type S without altering any of the desirable properties of the program (correctness, task performed, etc.).

**Plain English**: If code expects a parent type, any subtype should work just as well. You shouldn't need to check "is this actually X type?" — subtyping should be transparent.

**Classic violation — Rectangle/Square**:
\`\`\`
class Rectangle {
  void setWidth(int w) { this.width = w; }
  void setHeight(int h) { this.height = h; }
  int area() { return width * height; }
}

class Square extends Rectangle {  // "Square IS-A Rectangle"
  void setWidth(int w) { this.width = this.height = w; }
  void setHeight(int h) { this.width = this.height = h; }
}

// Client code:
void test(Rectangle r) {
  r.setWidth(5);
  r.setHeight(10);
  assert r.area() == 50;  // fails for Square! area = 100
}
\`\`\`

Even though "Square IS-A Rectangle" mathematically, in OOP they have different behavior. Passing a Square where a Rectangle is expected breaks correctness. LSP violated.

**LSP rules (behavioral subtyping)**:
1. **Preconditions**: Subclass can weaken (accept more inputs) but not strengthen
2. **Postconditions**: Subclass can strengthen (return more specific) but not weaken
3. **Invariants**: Parent's invariants must be preserved
4. **History constraint**: Subclasses shouldn't allow state changes the parent doesn't

**Common violations**:
- Throwing new exceptions the parent didn't declare
- Returning less precise results
- Requiring preconditions the parent didn't
- Having side effects the parent doesn't

**How to fix Rectangle/Square**:
Don't inherit! Use composition or make them both inherit from a common \`Shape\`:
\`\`\`
interface Shape { int area(); }
class Rectangle implements Shape { ... }
class Square implements Shape { ... }
\`\`\`
Now neither pretends to be the other. No LSP violation.

## Real-World Example
**Birds and flying**: \`class Bird { void fly() {...} }\`. Now \`class Penguin extends Bird\`. But penguins can't fly! If you call \`bird.fly()\` expecting it to work, you'll get an exception for Penguin. LSP violated.

**Fix**: Restructure: \`class Bird { void move(); }\` and \`class FlyingBird extends Bird { void fly(); }\`. Penguin extends Bird; Eagle extends FlyingBird.

**Immutable collections**: \`Collections.unmodifiableList(list)\` returns a List, but \`add()\` throws UnsupportedOperationException. This is a subtle LSP violation — code expecting List can't actually add.

## Interview Tips
- Memorize the rectangle/square example — classic illustration
- Connect to "IS-A" — true IS-A means genuinely substitutable
- Mention that LSP violations often signal bad inheritance — use composition instead

## Common Follow-up Questions
1. How does LSP relate to polymorphism? (LSP makes polymorphism safe — code works regardless of concrete subtype)
2. Is Java's \`Collection.add()\` throwing UnsupportedOperationException an LSP violation? (Yes, technically — a classic debated example)
3. How do you test for LSP compliance? (Write tests using the parent type — they should all pass for subtypes)`,

    'Open Closed': `## Definition
The **Open/Closed Principle (OCP)** — the "O" in SOLID — states that software entities (classes, modules, functions) should be **open for extension but closed for modification**. You should be able to add new behavior without changing existing code.

## Why It Matters
OCP minimizes the risk of breaking working code. Every time you modify existing code, you risk introducing bugs in functionality that previously worked. OCP enables safe evolution of software.

## Detailed Explanation

**"Open for extension"**: You can add new features.
**"Closed for modification"**: Adding features doesn't require editing existing, working code.

**The trick**: Use abstractions (interfaces, abstract classes) so new behavior comes from new classes, not changes to old ones.

**Violation example**:
\`\`\`
class PaymentProcessor {
  void process(Payment p) {
    if (p.type.equals("credit")) { /* credit logic */ }
    else if (p.type.equals("upi")) { /* upi logic */ }
    else if (p.type.equals("paypal")) { /* paypal logic */ }
  }
}
\`\`\`

Adding a new payment method (say, Crypto) requires **modifying** \`PaymentProcessor\` — violating OCP. You risk breaking credit, UPI, or PayPal accidentally.

**OCP-compliant solution (Strategy Pattern)**:
\`\`\`
interface PaymentStrategy { void process(Payment p); }

class CreditStrategy implements PaymentStrategy { ... }
class UPIStrategy implements PaymentStrategy { ... }
class PayPalStrategy implements PaymentStrategy { ... }

class PaymentProcessor {
  private Map<String, PaymentStrategy> strategies;
  void process(Payment p) {
    strategies.get(p.type).process(p);
  }
}
\`\`\`

Now adding Crypto payments means **creating a new \`CryptoStrategy\` class** and registering it. \`PaymentProcessor\` doesn't change. Existing logic isn't touched.

**Techniques to achieve OCP**:
1. **Strategy Pattern**: Swap algorithms via interface
2. **Template Method**: Define skeleton, let subclasses override specific steps
3. **Plugin architecture**: Load new behavior from external modules
4. **Dependency Injection**: Inject different implementations without changing the consumer
5. **Event/Observer system**: Subscribe new handlers without modifying the publisher

**When OCP matters most**:
- Code that changes frequently — multiple variants over time
- Public APIs and libraries — you can't modify once clients depend on it
- Domains with regulatory or business-rule volatility (payments, tax calculations, compliance)

**When to NOT over-apply OCP**:
- Code that's unlikely to change
- Simple cases with just 2-3 variants
- When abstraction adds more complexity than flexibility

**The key insight**: OCP doesn't mean you NEVER modify code — it means you design so that FUTURE expected changes don't require modification. Unexpected changes still require rethinking.

## Real-World Example
**Notification systems**: A naive design hardcodes email, SMS, and push notifications into one class. Adding Slack notifications means editing the notification class.

OCP-compliant: Define \`Notifier\` interface. Each notification type is a separate class (\`EmailNotifier\`, \`SMSNotifier\`, \`SlackNotifier\`). Adding Slack = adding a class. No existing code touched.

**Plugin systems** like IDE extensions, browser extensions, WordPress plugins — all built on OCP. The core application is closed for modification; users add behavior via new plugins.

**Java's Comparator**: \`Collections.sort()\` uses OCP perfectly. Instead of hardcoding comparison logic, it accepts a \`Comparator\`. You add new sort orders by creating new Comparators — the sort function never changes.

## Interview Tips
- Give the payment processor example — it's universally clear
- Connect OCP to design patterns: Strategy, Template Method, Decorator all enable OCP
- Mention "favor composition over inheritance" aligns with OCP

## Common Follow-up Questions
1. Does OCP mean never editing code? (No — means designing for expected extension points)
2. OCP vs LSP? (OCP: add new behavior without modification. LSP: ensure new subtypes are substitutable)
3. How does dependency injection support OCP? (Swapping implementations without changing consumers)`,

    'Interface Segregation': `## Definition
The **Interface Segregation Principle (ISP)** — the "I" in SOLID — states that no client should be forced to depend on methods it does not use. Instead of one large, general-purpose interface, create multiple smaller, specific interfaces so clients only need to know about what's relevant to them.

## Why It Matters
Fat interfaces create unnecessary coupling. Changes to one method force recompilation and potential rework in classes that don't even use that method. ISP keeps interfaces focused and changes localized.

## Detailed Explanation

**Violation example — "Fat Interface"**:
\`\`\`
interface Worker {
  void work();
  void eat();
  void sleep();
}

class HumanWorker implements Worker {
  public void work() { ... }
  public void eat() { ... }
  public void sleep() { ... }
}

class RobotWorker implements Worker {
  public void work() { ... }
  public void eat() { throw new UnsupportedOperationException(); }  // awkward!
  public void sleep() { throw new UnsupportedOperationException(); }  // awkward!
}
\`\`\`

Robot is forced to implement eat() and sleep() it doesn't use. Any change to Worker's eat() signature breaks Robot even though it doesn't care. ISP violated.

**ISP-compliant solution — Split into focused interfaces**:
\`\`\`
interface Workable { void work(); }
interface Eatable { void eat(); }
interface Sleepable { void sleep(); }

class HumanWorker implements Workable, Eatable, Sleepable {
  public void work() { ... }
  public void eat() { ... }
  public void sleep() { ... }
}

class RobotWorker implements Workable {
  public void work() { ... }
  // No eat or sleep — doesn't need them!
}
\`\`\`

Now each class implements only what it needs. Changes to \`Eatable\` don't affect Robot.

**Signs your interfaces violate ISP**:
- Implementations full of \`throw UnsupportedOperationException\`
- Implementations with empty methods (\`{}\`)
- Comments like "this class doesn't use this method but has to implement it"
- Clients depending on interfaces that have many methods they don't call

**Benefits of ISP**:
- **Reduced coupling**: Changes to one interface don't ripple to unrelated classes
- **Better abstraction**: Interfaces represent focused roles, not "everything this kind of thing does"
- **Easier mocking**: Smaller interfaces = simpler mocks for testing
- **Clearer design intent**: Interface names describe specific capabilities

**Common guideline**: If you find yourself splitting an interface, name the new ones after capabilities/roles (\`Readable\`, \`Writable\`, \`Closeable\`) rather than entity types (\`Worker\`, \`User\`).

**ISP in practice**: Interfaces should be **role-based**, not **entity-based**. A class can play multiple roles by implementing multiple interfaces. This aligns with "composition over inheritance."

## Real-World Example
**Java's I/O**: \`Readable\`, \`Closeable\`, \`Flushable\`, \`AutoCloseable\` are separate small interfaces. A class like \`FileReader\` implements the ones it needs. Clients depending on only "can be closed" type their variable as \`Closeable\` and don't pull in other methods.

**JPA/Hibernate Repository pattern**: Spring Data offers focused interfaces: \`CrudRepository\`, \`PagingAndSortingRepository\`, \`JpaRepository\`. You extend only what you need. If you don't need paging, don't extend \`PagingAndSortingRepository\`.

**HTTP handlers**: Instead of one giant \`RequestHandler\` with getParameter, getHeader, getBody, getCookies, getSession, etc. — split into focused interfaces like \`HeaderAccessor\`, \`BodyReader\`, \`CookieManager\`. A handler that only reads headers doesn't depend on body-reading logic.

## Interview Tips
- Use the Worker/Robot example — simple and clear
- Mention "role-based interfaces" — shows sophisticated OOP thinking
- Connect to testing: smaller interfaces = easier mocks

## Common Follow-up Questions
1. Can ISP lead to interface explosion? (Yes — balance is needed. Interfaces should have reasonable cohesion.)
2. Does ISP apply in languages without interfaces? (Yes — applies to any contract/API surface)
3. ISP vs Single Responsibility? (Related but different — SRP is about classes; ISP is about interfaces clients see)`,

    'Dependency Inversion': `## Definition
The **Dependency Inversion Principle (DIP)** — the "D" in SOLID — states that:
1. High-level modules should not depend on low-level modules; both should depend on abstractions.
2. Abstractions should not depend on details; details should depend on abstractions.

In short: **depend on interfaces, not concrete implementations**.

## Why It Matters
DIP is what makes software flexible, testable, and maintainable at scale. Every major framework (Spring, Angular, .NET Core) is built around DIP. Master DIP and you understand how professional software is architected.

## Detailed Explanation

**Traditional (bad) dependency direction**:
\`\`\`
[High-level: OrderService] ----depends on----> [Low-level: MySQLDatabase]
\`\`\`

\`OrderService\` directly uses \`MySQLDatabase\`. If you want to switch to PostgreSQL, change the testing setup, or add caching, you modify OrderService.

**Inverted (good) dependency direction**: Both high-level and low-level code depend on an abstraction (interface). The low-level code implements the abstraction; the high-level code uses the abstraction.

**Example violation**:
\`\`\`
class EmailService {  // high-level
  private SMTPClient smtp = new SMTPClient();  // low-level concrete
  
  void sendEmail(String to, String body) {
    smtp.connect("smtp.gmail.com");
    smtp.send(to, body);
  }
}
\`\`\`

Hard-coded to SMTP. Can't swap for SendGrid API, mock for testing, or add retry logic without modifying EmailService.

**DIP-compliant**:
\`\`\`
interface EmailSender {
  void send(String to, String body);
}

class SMTPSender implements EmailSender { ... }
class SendGridSender implements EmailSender { ... }
class MockSender implements EmailSender { ... }  // for tests

class EmailService {
  private EmailSender sender;
  public EmailService(EmailSender sender) {  // injected
    this.sender = sender;
  }
  void sendEmail(String to, String body) {
    sender.send(to, body);
  }
}
\`\`\`

\`EmailService\` knows about \`EmailSender\` (abstraction) but not which implementation. At runtime, you plug in the one you want.

**DIP vs Dependency Injection**:
- **DIP**: The principle ("depend on abstractions")
- **Dependency Injection (DI)**: One technique to implement DIP (passing dependencies in from outside)
- **IoC Container**: A framework that automates DI (Spring, Angular injector)

**Benefits of DIP**:
- **Testability**: Swap real dependencies for mocks
- **Flexibility**: Change implementations without modifying consumers
- **Parallel development**: Teams can work on different layers simultaneously with agreed interfaces
- **Easier upgrades**: Replace old tech with new tech at the implementation layer

**Common indicators of DIP violations**:
- \`new SomeConcreteClass()\` calls inside business logic
- Hardcoded dependencies (database URLs, API endpoints, file paths)
- Classes difficult to unit test because you can't mock dependencies
- Changes in low-level code forcing changes in high-level code

## Real-World Example
**Spring Framework**: Every \`@Service\`, \`@Repository\`, \`@Controller\` uses DIP. Services depend on repository interfaces. At startup, Spring injects the concrete repository implementation. Tests inject mocks. Production injects real databases. The service code doesn't change.

**Plugin architectures**: Editors like VS Code depend on extension APIs (abstractions). Extensions are the low-level code. VS Code doesn't know which extensions exist — it only knows the API contract. Classic DIP.

**Hardware drivers**: Operating systems depend on driver interfaces. Hardware vendors implement drivers. The OS doesn't know about specific GPU models — it knows the "GPU driver" contract. Swap GPUs, swap drivers — OS code doesn't change.

## Interview Tips
- State DIP in both forms: "Depend on abstractions" and "inverts the usual flow"
- Have a before/after example ready (EmailService is a great one)
- Connect DIP to DI and IoC containers — shows broader understanding
- Mention testability as a primary driver

## Common Follow-up Questions
1. DIP vs Dependency Injection vs IoC? (Principle, technique, framework — progressively concrete)
2. Why is it called "inversion"? (Flips the direction of source-level dependency — details now depend on abstractions, not the other way around)
3. Does every dependency need an interface? (No — only where abstraction provides real value: flexibility, testability, or future change)`,

    'Law of Demeter': `## Definition
The **Law of Demeter (LoD)** — also called the **Principle of Least Knowledge** — states that an object should only communicate with its immediate "friends" and not with strangers. Specifically, a method should only call methods of: itself, its parameters, objects it creates, and its direct fields — never methods of returned objects.

## Why It Matters
Law of Demeter prevents tight coupling between distantly related parts of a system. Violations create fragile chains where changes in one class break seemingly unrelated classes. Mastering LoD is a hallmark of senior engineers.

## Detailed Explanation

**The rule — "Only talk to your immediate friends"**. In a method, you should only invoke methods on:
1. **The object itself** (\`this.something()\`)
2. **Parameters passed to the method** (\`param.something()\`)
3. **Objects created within the method** (\`new Thing().something()\`)
4. **Direct fields of the current object** (\`this.field.something()\`)
5. **Global objects** (static, though use sparingly)

You should NOT invoke methods on objects RETURNED from other method calls. This creates "train wrecks."

**Violation example — train wreck**:
\`\`\`
customer.getOrder().getItems().get(0).getProduct().getPrice();
\`\`\`

This code knows about:
- Customer (has getOrder)
- Order (has getItems)
- List/Items (has get)
- OrderItem (has getProduct)
- Product (has getPrice)

If ANY of these classes change (method rename, return type change, refactor), this line breaks. It's tightly coupled to five different classes, most of which it has no business knowing about.

**LoD-compliant fix — "Tell, Don't Ask"**:
\`\`\`
double price = customer.getFirstOrderItemPrice();
\`\`\`

Customer handles the internal chain. The caller only knows about Customer. If Order's structure changes, Customer adjusts — calling code stays stable.

**Better yet, move behavior to the object**:
Instead of asking for data and working with it externally, tell the object what to do:
\`\`\`
// Bad — asks for data
if (customer.getAccount().getBalance() > 1000) { /* apply discount */ }

// Good — tells the object
customer.applyDiscountIfEligible();
\`\`\`

**Common LoD violations**:
- Method chains on unrelated objects (\`a.b().c().d()\`)
- "Getter chains" exposing deep internals
- Passing objects just so callers can dig into them
- Reaching through collaborators to find data

**When LoD-like chains ARE acceptable**:
- **Builder patterns** (fluent interfaces): \`StringBuilder.append("a").append("b").toString()\` — each method returns \`this\`, intended design
- **Stream operations**: \`list.stream().filter(...).map(...).collect(...)\` — each returns a stream, designed for chaining
- **Value objects**: Accessing fields of simple data containers (DTOs) is often fine

The distinction: LoD violations expose INTERNAL STRUCTURE of unrelated objects. Fluent APIs and streams are EXPLICITLY designed for chaining — the structure is the point.

**LoD and encapsulation**: LoD reinforces encapsulation. If you must chain through objects to get data, those objects have leaky encapsulation — they're exposing their guts.

## Real-World Example
**Violation in web code**:
\`\`\`
request.getSession().getAttribute("user").getProfile().getPreferences().getLanguage();
\`\`\`

Deeply coupled. If session storage changes, user model changes, or preference system is refactored — this breaks.

**Fix**: \`request.getUserLanguage()\` — the request (or a helper service) handles the traversal internally.

**Another example — paperboy problem**: Imagine a paperboy who needs to be paid. LoD violation: paperboy reaches into customer's pocket, takes wallet, opens wallet, takes money. LoD-compliant: paperboy asks customer to pay; customer handles their own wallet.

\`\`\`
// Bad
Money payment = customer.getWallet().getMoney(amount);

// Good
Money payment = customer.pay(amount);
\`\`\`

## Interview Tips
- Mention "train wrecks" — memorable terminology
- Know "Tell, Don't Ask" — the corollary principle
- Distinguish valid chains (fluent APIs) from LoD violations (dependency reaching)
- Connect to "No chaining reduces coupling" — the short version

## Common Follow-up Questions
1. Does LoD forbid all method chaining? (No — only chains that traverse unrelated objects' internals)
2. LoD vs Encapsulation? (Related — LoD enforces encapsulation across object boundaries)
3. What's "Tell, Don't Ask"? (Prefer telling objects what to do rather than asking for their data and acting on it externally)`
  },

  'OS': {
    'Process vs Thread': `## Definition
A **process** is an independent program in execution with its own memory space, resources, and state. A **thread** is a lightweight unit of execution within a process — threads of the same process share memory and resources but have their own stack and program counter.

## Why It Matters
This is THE most asked OS interview question. Understanding the difference explains concurrency, parallelism, and why modern applications use one vs the other for performance and isolation.

## Detailed Explanation

**Process**:
- Has its own virtual address space (code, data, heap, stack)
- Isolated from other processes by the OS
- Communication between processes (IPC) is expensive — pipes, sockets, shared memory
- Heavy context switching — OS must swap entire memory mappings
- Crashing one process doesn't affect others
- Example: Chrome runs each tab as a separate process

**Thread**:
- Exists within a process
- Shares code, data, heap, and open files with other threads in the same process
- Has its own stack, program counter, and registers
- Cheap communication — just read/write shared variables
- Fast context switching — no memory mapping change
- Crashing a thread can crash the whole process
- Example: Your web browser's rendering, network, and UI threads share data within one tab process

**Comparison table**:

| Aspect | Process | Thread |
|--------|---------|--------|
| Memory | Separate address space | Shared within process |
| Creation cost | High (fork, allocate memory) | Low (share resources) |
| Communication | IPC (expensive) | Shared memory (cheap) |
| Context switch | Slow | Fast |
| Isolation | Strong (crash isolated) | Weak (crash affects process) |
| Synchronization | Less needed | Critical (mutexes, locks) |
| OS overhead | Heavy | Light |

**When to use processes**:
- Need isolation (security, stability)
- Running different programs
- Fault tolerance matters (one crash shouldn't kill everything)

**When to use threads**:
- Parallelism within one application
- Heavy shared data
- Need fast communication
- Example: Web server handling multiple requests

## Real-World Example
**Chrome browser**: Each tab is a process (if one crashes, others survive). Within a tab, multiple threads handle rendering, JavaScript execution, and network I/O — sharing the tab's memory for speed.

**Web servers like Apache** (pre-fork mode): Each request = a new process. Isolated but slow. **Nginx**: uses threads/events within fewer processes — faster but requires careful sync.

## Interview Tips
- Have both tables (differences) and examples memorized
- Know that "green threads" / user-level threads are even lighter than OS threads
- Mention that Python's GIL limits true thread parallelism in CPython

## Common Follow-up Questions
1. Can threads of different processes share memory? (Not directly — need shared memory IPC)
2. What's a fiber / coroutine? (Even lighter than threads — cooperative, not OS-scheduled)
3. How does fork() relate? (Creates a new process by duplicating the caller; threads don't duplicate)`,

    'What is Deadlock': `## Definition
A **deadlock** is a situation in concurrent computing where two or more processes/threads are each waiting indefinitely for resources held by the other, resulting in none of them making progress. The classic stalemate of operating systems.

## Why It Matters
Deadlock is a top real-world production issue in multi-threaded applications. Understanding the four necessary conditions (Coffman conditions) and prevention strategies is essential for building reliable concurrent systems.

## Detailed Explanation

**Four necessary conditions (Coffman conditions)** — ALL must hold simultaneously:

**1. Mutual Exclusion**: At least one resource must be held in non-shareable mode. Only one process can use it at a time (like a lock, printer, or file with exclusive access).

**2. Hold and Wait**: A process holding at least one resource is waiting to acquire additional resources that are currently held by others.

**3. No Preemption**: Resources cannot be forcibly taken from a process — they must be voluntarily released after the process finishes using them.

**4. Circular Wait**: A circular chain of processes exists where each process holds a resource that the next one needs, forming a cycle. P1 waits for P2's resource, P2 waits for P3's, ..., Pn waits for P1's.

**Classic example — two threads, two locks**:
\`\`\`
Thread A: lock(L1); ... lock(L2);  // holds L1, wants L2
Thread B: lock(L2); ... lock(L1);  // holds L2, wants L1
\`\`\`
A waits for L2 (held by B); B waits for L1 (held by A). Both stuck forever.

**Deadlock handling strategies**:

**1. Prevention — break one of the four conditions**:
- Remove Mutual Exclusion (impossible for inherently non-shareable resources)
- Remove Hold and Wait: require all resources upfront
- Allow Preemption: force release of held resources
- Remove Circular Wait: impose strict lock ordering (always acquire L1 before L2)

**2. Avoidance — Banker's Algorithm**: System checks if granting a resource leads to a safe state; denies if it could cause deadlock. Requires knowing max resource needs in advance.

**3. Detection + Recovery**: Let deadlocks happen, detect via cycle detection in resource-allocation graph, then recover (kill a process, rollback, or steal resources).

**4. Ignore (Ostrich algorithm)**: Pretend deadlocks don't happen. Surprisingly common — used by Unix, Windows for rare cases. Restart the system if it happens.

**Deadlock vs related concepts**:
- **Livelock**: Processes actively change state but make no progress (like two people moving side-to-side to avoid each other)
- **Starvation**: A process never gets resources because others keep cutting in line
- **Race condition**: Outcome depends on timing, not necessarily stuck forever

## Real-World Example
**Database deadlock**: Transaction A locks row 1, wants row 2. Transaction B locks row 2, wants row 1. PostgreSQL/MySQL detect this via cycle detection in the wait-for graph and abort one transaction (victim selection).

**Bank transfer example**: 
\`\`\`
Transfer(A, B): lock(A); lock(B); // move money
Transfer(B, A): lock(B); lock(A); // different direction
\`\`\`
If both execute concurrently, deadlock. Fix: always lock accounts in a consistent order (e.g., by account ID).

## Interview Tips
- Memorize the four Coffman conditions — often asked verbatim
- Know at least one prevention technique per condition
- Mention lock ordering as the most practical real-world prevention
- Database deadlock detection is a common follow-up

## Common Follow-up Questions
1. Difference between deadlock and livelock? (Deadlock: no state change. Livelock: change but no progress)
2. How does the Banker's Algorithm work? (Simulates allocation, checks if safe state remains)
3. Why is lock ordering effective? (Eliminates circular wait — can't form cycle if order is enforced)`,

    'Virtual Memory Paging': `## Definition
**Virtual Memory** is a memory management technique that gives each process the illusion of having its own large, contiguous address space, even when physical RAM is smaller or shared. **Paging** is the primary mechanism — virtual memory is divided into fixed-size blocks called **pages**, which map to physical memory blocks called **frames**.

## Why It Matters
Virtual memory is what lets you run programs larger than RAM, isolates processes from each other, and enables efficient memory sharing. Understanding it explains everything from segfaults to swap files to how kernel vs user space works.

## Detailed Explanation

**Key components**:

**1. Virtual address space**: Each process sees a flat, huge address space (typically 4GB on 32-bit, 16EB theoretical on 64-bit). Program uses virtual addresses — doesn't know or care about physical memory layout.

**2. Physical memory (RAM)**: Actual hardware memory, divided into frames (typically 4KB each).

**3. Page table**: A per-process data structure mapping virtual pages to physical frames. When a process accesses memory, the MMU (Memory Management Unit) consults the page table to translate virtual → physical.

**4. TLB (Translation Lookaside Buffer)**: Hardware cache of recent page table entries. Makes translation fast (microseconds instead of multiple memory accesses).

**How a memory access works**:
1. Program references virtual address \`0x1234\`
2. MMU splits into page number + offset
3. MMU checks TLB first (fast)
4. If TLB miss, walk the page table (slower)
5. Get physical frame number; combine with offset = physical address
6. Access physical memory

**Page fault**: If the page isn't in RAM (never loaded or swapped out to disk), hardware triggers a page fault interrupt. The OS:
1. Finds the page on disk
2. Picks a frame (possibly evicting another page — page replacement)
3. Loads the page into the frame
4. Updates the page table
5. Resumes the program

**Benefits**:
- **Memory isolation**: Each process has its own page table — can't access others' memory
- **Larger-than-RAM programs**: Swap pages in/out as needed
- **Shared memory**: Multiple page tables can map to the same frame (for shared libraries)
- **Copy-on-write**: Fork() shares pages; only copies when written
- **Memory-mapped files**: Treat files as memory

**Trade-offs**:
- **Performance**: TLB misses and page faults are slow
- **Memory overhead**: Page tables themselves take memory (multi-level page tables solve this partially)
- **Thrashing**: If working set exceeds RAM, excessive swapping destroys performance

## Real-World Example
**Linux \`free\` command** shows how virtual memory uses RAM + swap. When RAM fills up, the OS moves inactive pages to swap disk.

**Memory-mapped files**: \`mmap()\` maps a file's contents into the process's virtual address space. Accessing "memory" actually reads file contents; OS pages them in on demand. This is how databases like SQLite can efficiently work with huge files.

**Copy-on-write fork**: When Linux forks a process, it doesn't duplicate all memory. Instead, parent and child share pages marked read-only. First time either one writes, the OS copies just that page. Makes fork() incredibly fast.

## Interview Tips
- Know the page → frame → page table → TLB pipeline
- Understand page fault handling step by step
- Mention multi-level page tables (Linux uses 4-level paging on x86-64)
- Know thrashing and working set concepts

## Common Follow-up Questions
1. What's thrashing? (Page faults so frequent CPU spends all time swapping)
2. Why use multi-level page tables? (Memory-efficient for sparse address spaces)
3. What's a huge page? (Larger page size — 2MB or 1GB — fewer TLB entries for same memory)`,

    'Mutex vs Semaphore': `## Definition
A **mutex** (mutual exclusion) is a locking mechanism ensuring that only ONE thread can access a resource at a time. A **semaphore** is a counter that can allow a specified number (N) of threads to access a resource simultaneously. Mutex is binary (locked/unlocked); semaphore is general (count-based).

## Why It Matters
Choosing the wrong synchronization primitive causes race conditions, deadlocks, and performance issues. Understanding when to use each is fundamental for concurrent programming.

## Detailed Explanation

**Mutex (Mutual Exclusion Lock)**:
- Binary: either locked or unlocked
- Has an OWNER: the thread that locked it is the only one that can unlock it
- Used to protect shared data (critical sections)
- Typical use: only one thread should modify a variable at a time

\`\`\`
mutex.lock();
// critical section — exclusive access
sharedCounter++;
mutex.unlock();
\`\`\`

**Semaphore**:
- Counter-based: initialized with value N (capacity)
- Two operations: \`wait()\` (decrement; block if 0) and \`signal()\` (increment)
- NO ownership: any thread can signal, even if it didn't wait
- Can be binary (N=1) — but still different semantics from mutex

\`\`\`
semaphore = new Semaphore(3);  // allow 3 concurrent accesses

semaphore.wait();   // decrements; blocks if already at 0
// use resource — up to 3 threads here at once
semaphore.signal(); // increments
\`\`\`

**Key differences**:

| Aspect | Mutex | Semaphore |
|--------|-------|-----------|
| Purpose | Mutual exclusion | Counting resources |
| Value | Binary (locked/unlocked) | Integer (0 to N) |
| Ownership | Yes (lock holder) | No |
| Who unlocks | Only the locker | Any thread can signal |
| Typical use | Protect shared data | Control concurrent access count |

**Two types of semaphores**:
- **Counting semaphore**: Allows N concurrent accesses (e.g., limit to 10 DB connections)
- **Binary semaphore**: N=1 — similar to mutex but no ownership — useful for signaling between threads

**When to use each**:

**Use mutex when**:
- Protecting a critical section (exclusive access)
- The same thread must lock and unlock
- Simple mutual exclusion

**Use semaphore when**:
- Allowing multiple (N>1) concurrent accesses (connection pools, rate limiting)
- Signaling between threads (producer-consumer, e.g., buffer slots)
- One thread needs to wake another

**Common pitfalls**:
- **Forgetting to unlock mutex** → deadlock
- **Unbalanced signal/wait** → wrong count, starvation
- **Mutex across processes** → need special inter-process mutex
- **Semaphore used as mutex without discipline** → since no ownership, bugs are subtle

## Real-World Example
**Database connection pool**: Semaphore initialized to pool size (e.g., 10). Each \`getConnection()\` calls wait(); each \`release()\` signals. If 10 connections are in use, the 11th request blocks until one is released.

**Producer-consumer**: Two semaphores — \`items\` (initially 0) and \`spaces\` (initially N). Producer waits on spaces, signals items. Consumer waits on items, signals spaces. Mutex additionally protects buffer modifications.

**File locking**: A mutex prevents two threads from simultaneously writing to a log file, avoiding interleaved output.

## Interview Tips
- Emphasize ownership difference: "Mutex has owner, semaphore doesn't"
- Know binary semaphore vs mutex — subtle but asked often
- Producer-consumer is a classic semaphore scenario — memorize it
- Mention priority inversion (mutex can have it, solved by priority inheritance)

## Common Follow-up Questions
1. Binary semaphore vs mutex? (Both binary, but mutex has ownership; semaphore used for signaling)
2. What's priority inversion? (Low-priority holds lock; high-priority waits; medium-priority preempts low — high effectively blocked by medium)
3. Spinlock vs mutex? (Spinlock busy-waits; mutex puts thread to sleep — spinlocks are for very short waits)`,

    'CPU Scheduling': `## Definition
**CPU Scheduling** is the process by which the OS decides which process/thread gets to use the CPU at any given time. The scheduler runs inside the OS kernel and is invoked whenever a process needs to be selected — switching between ready processes to maximize CPU utilization and meet system goals.

## Why It Matters
Scheduling directly affects system responsiveness, throughput, fairness, and energy efficiency. Different algorithms suit different workloads — understanding trade-offs is essential for system design and performance tuning.

## Detailed Explanation

**Scheduling goals (often conflicting)**:
- **CPU utilization**: Keep the CPU busy
- **Throughput**: Maximize processes completed per unit time
- **Turnaround time**: Minimize time from submission to completion
- **Waiting time**: Minimize time in ready queue
- **Response time**: Minimize time from submission to first response (interactive)
- **Fairness**: Every process gets a fair share

**Common algorithms**:

**1. First-Come, First-Served (FCFS)**:
- Processes run in arrival order
- Simple, fair in a queue sense
- **Convoy effect**: Long process at front blocks many short ones
- Non-preemptive

**2. Shortest Job First (SJF)**:
- Pick the process with shortest burst time
- Optimal for minimizing average waiting time
- Problem: future burst times are unknown — requires estimation
- Can starve long processes

**3. Priority Scheduling**:
- Each process has a priority; highest runs first
- Preemptive (new higher-priority preempts) or non-preemptive
- Problem: **starvation** of low-priority processes
- Solution: **aging** — gradually increase priority of waiting processes

**4. Round Robin (RR)**:
- Each process gets a fixed time slice (quantum), then rotates
- Fair, good for interactive systems
- Quantum too large → becomes FCFS; too small → excessive context switching

**5. Multilevel Queue**:
- Multiple queues for different process types (system, interactive, batch)
- Each queue has its own algorithm
- Queues can have priorities between them

**6. Multilevel Feedback Queue**:
- Like multilevel queue but processes can MOVE between queues
- Interactive processes stay in high-priority queue; CPU-bound processes drop to lower priority
- Used in Unix, Windows, Linux (CFS)

**Preemptive vs Non-preemptive**:
- **Preemptive**: OS can interrupt a running process (modern OSes use this)
- **Non-preemptive**: Process runs until it yields or finishes

**Modern schedulers**:
- **Linux CFS (Completely Fair Scheduler)**: Uses a red-black tree sorted by "virtual runtime." Each process gets CPU proportional to its nice value.
- **Windows**: Uses priority-based scheduling with 32 priority levels and dynamic adjustments.

## Real-World Example
**Linux CFS**: When you run \`ls\` while compiling code, CFS ensures interactive commands get quick response even if compilation is CPU-intensive. \`nice\` values adjust fairness.

**Real-time systems** (medical devices, avionics): Use strict priority scheduling or EDF (Earliest Deadline First) — guaranteed response times matter more than fairness.

**Mobile OSes**: Power-aware scheduling — may consolidate work to one core so others sleep.

## Interview Tips
- Know SJF is optimal for average waiting time (theoretically)
- Round Robin's quantum choice is a classic trade-off question
- Mention starvation and aging together — shows depth
- Linux CFS is a great modern example to cite

## Common Follow-up Questions
1. Why is SJF not always used? (Burst times are unknown in practice)
2. How does aging solve starvation? (Priority increases with waiting time)
3. What's the "convoy effect"? (Short processes stuck behind long one in FCFS)`,

    'Context Switching': `## Definition
**Context switching** is the process by which the OS saves the state of a currently running process/thread and loads the state of another, allowing multiple processes to share a single CPU. The "context" includes CPU registers, program counter, stack pointer, and memory mappings.

## Why It Matters
Context switches are not free — they take time (microseconds) and have hidden costs (cache invalidation). Understanding the overhead explains why too many threads can hurt performance, why async/event-driven models became popular, and why context-switch reduction is a performance optimization.

## Detailed Explanation

**When does context switching happen**:
1. **Time quantum expires** (preemptive scheduling)
2. **Process blocks** on I/O or synchronization
3. **Interrupt occurs** (hardware event, higher priority task)
4. **System call** that must wait
5. **Process terminates**

**Steps in a context switch**:
1. **Save state of current process**:
   - CPU registers (including general-purpose registers)
   - Program counter (PC) — where it was executing
   - Stack pointer (SP)
   - Memory management info (page table pointer for process switches)
   - CPU flags
2. **Scheduler picks next process** to run
3. **Load state of next process**:
   - Restore all registers
   - Restore memory mappings (flush TLB if new process!)
   - Update kernel data structures
4. **Resume execution** at the new process's saved PC

All this state is stored in the **PCB (Process Control Block)** for each process.

**Cost of a context switch**:
- **Direct cost**: Typically 1–100 microseconds — saving/loading registers and kernel bookkeeping
- **Indirect cost (often bigger)**:
  - **TLB flush**: New process = new page table = TLB invalidation = slow memory accesses until TLB refills
  - **Cache pollution**: New process evicts old process's data from L1/L2/L3 caches
  - **Pipeline stall**: CPU pipelines may need to be cleared

**Thread context switch is cheaper than process**:
- Same process = same address space = same TLB, no flush
- Only registers and stack pointer need to change
- Much faster (sub-microsecond often)

**User-level context switching**:
- Can happen without OS involvement (coroutines, fibers, green threads)
- Cheaper still — no mode switch to kernel
- Example: Go's goroutines, Python's asyncio

**Reducing context switches**:
- Use fewer threads than OS threads (use event loops, async I/O)
- Batch work per thread
- Pin threads to specific cores (reduces cache misses across cores)
- Use larger time quanta (trade responsiveness for throughput)

## Real-World Example
**High-performance servers**: Nginx outperforms Apache (prefork mode) partly because Nginx uses fewer processes/threads with event-driven I/O. Each Apache request = potential context switch; Nginx handles thousands of connections per thread without switching.

**Node.js event loop**: Single-threaded for JavaScript — NO context switches between concurrent requests in the JS layer. I/O is handled by a thread pool, but user code runs in one thread.

**High-frequency trading**: Pin threads to CPU cores; disable CPU power management; use busy-waiting spinlocks — anything to avoid context switches that cost microseconds (millions in money).

## Interview Tips
- Know that a context switch involves more than just saving registers — TLB and cache effects matter
- Thread switch < process switch (different cost)
- Mention async/event loops as a way to avoid context switches
- Cost is typically 1–10 microseconds — useful ballpark

## Common Follow-up Questions
1. Why are thread switches cheaper? (Same address space — no TLB flush, cache preserved)
2. What's a "cold cache" problem? (After a switch, new process's data isn't in cache — slow initial memory accesses)
3. Can context switch happen during a system call? (Yes, often — when the call blocks)`,

    'Stack vs Heap': `## Definition
The **stack** is a region of memory used for static/automatic storage — function calls, local variables — with LIFO (Last In, First Out) allocation. The **heap** is a region used for dynamic memory allocation — objects whose lifetime is determined by the programmer, not function scope.

## Why It Matters
Understanding stack vs heap explains why recursion can cause stack overflow, why small local variables are fast, why objects are usually on the heap, and how memory management differs between languages.

## Detailed Explanation

**Stack**:
- **Allocation**: Automatic, done by the compiler via stack pointer manipulation
- **Deallocation**: Automatic when function returns — just move stack pointer
- **Lifetime**: Tied to function scope
- **Size**: Small (typically 1-8 MB per thread) — limited by OS
- **Access speed**: Very fast — LIFO, usually cached
- **Thread safety**: Each thread has its own stack
- **Contents**: Function call frames (return address, arguments, local variables, saved registers)

**Heap**:
- **Allocation**: Manual (malloc/new) or by garbage collector
- **Deallocation**: Manual (free/delete) or automatic (GC)
- **Lifetime**: Until explicitly freed or GC reclaims it
- **Size**: Large (gigabytes) — limited by RAM/swap
- **Access speed**: Slower — can be anywhere in memory, more cache misses
- **Thread safety**: Shared between threads; needs synchronization
- **Contents**: Dynamically created objects, arrays, data structures

**Example in C**:
\`\`\`c
int main() {
  int x = 5;              // stack
  int* y = malloc(4);     // y is on stack; *y is on heap
  int arr[100];           // stack
  int* big = malloc(1000000 * sizeof(int));  // heap
  free(y); free(big);     // heap requires explicit cleanup
}  // x, arr automatically freed when main returns
\`\`\`

**Comparison table**:

| Aspect | Stack | Heap |
|--------|-------|------|
| Speed | Very fast | Slower |
| Size | Small (MB) | Large (GB) |
| Allocation | Automatic (function entry) | Manual or via new/malloc |
| Deallocation | Automatic (function return) | Manual or GC |
| Fragmentation | None (LIFO) | Can fragment |
| Thread safety | Per-thread stack | Shared — needs sync |
| Flexibility | Fixed at compile | Dynamic size |
| Cause of errors | Stack overflow (too deep recursion) | Memory leaks, use-after-free |

**Stack overflow**: Happens when the stack grows too large — usually from deep recursion or huge local arrays. The OS kills the process.

**Heap fragmentation**: Repeated alloc/free of different sizes leaves gaps. Can make large allocations fail even if total free memory is sufficient.

**Where objects go**:
- C/C++: Programmer decides (\`int x\` stack, \`new int\` heap)
- Java: Primitives and references on stack; actual objects on heap (always, except tiny escape-analyzed)
- Go: Compiler decides via escape analysis — objects that don't escape stay on stack
- Rust: Stack by default; explicit \`Box\`, \`Vec\`, etc., for heap

## Real-World Example
**Recursive algorithms**: Each recursive call pushes a frame onto the stack. A naive recursive Fibonacci with n=10000 → stack overflow. Solution: use iteration or tail-call optimization (in languages that support it).

**Performance-critical code (game engines, HFT)**: Prefer stack allocation when possible. \`std::array\` (stack) is faster than \`std::vector\` (heap) for small fixed sizes.

## Interview Tips
- Know that stack = LIFO + fast + small; heap = dynamic + slow + large
- Stack overflow is usually from recursion; heap issues are leaks/corruption
- Primitives typically go on stack; objects usually on heap (language-dependent)
- Mention escape analysis as a modern optimization

## Common Follow-up Questions
1. What causes stack overflow? (Deep recursion, huge local variables)
2. Can the JVM put objects on stack? (Yes — escape analysis optimization)
3. Why is stack faster? (Sequential access, usually in cache; allocation is just incrementing SP)`,

    'IPC Methods': `## Definition
**Inter-Process Communication (IPC)** refers to mechanisms that allow processes to exchange data and synchronize actions. Since processes have separate memory spaces, they need special OS-provided mechanisms to communicate safely and efficiently.

## Why It Matters
Modern applications are composed of multiple processes (microservices, browser tabs, worker processes). Knowing IPC methods helps you design scalable, fault-tolerant systems and understand trade-offs between performance and flexibility.

## Detailed Explanation

**Common IPC mechanisms**:

**1. Pipes**:
- **Anonymous pipe**: One-way communication between parent and child (via fork). Byte stream.
- **Named pipe (FIFO)**: Unrelated processes can connect via a filesystem path.
- Simple, fast for related processes.
- Example: \`cat file.txt | grep "error"\` — shell pipes stdout of cat to stdin of grep.

**2. Message Queues**:
- Processes send/receive discrete messages via a shared queue.
- OS-managed; survives process termination (System V queues).
- Better than pipes for structured messages.
- Modern alternative: POSIX message queues.

**3. Shared Memory**:
- **Fastest IPC** — processes share a memory region directly (no copying).
- Requires synchronization (semaphores, mutexes) — two processes writing same location = race.
- Good for large data transfers between tightly cooperating processes.
- Example: \`shmget\`, \`shmat\` in System V; \`mmap\` on Linux.

**4. Sockets**:
- **Network sockets** (TCP/UDP): Processes communicate over network, including localhost.
- **Unix domain sockets**: Local-only, faster than TCP, use filesystem paths.
- Most flexible — works locally or across machines.
- Example: Web server and database communicating via TCP sockets.

**5. Signals**:
- Asynchronous notifications to processes (SIGTERM, SIGKILL, SIGUSR1).
- Very limited data (just the signal number) — signaling, not data transfer.
- Example: \`kill -9 pid\` sends SIGKILL.

**6. Semaphores**:
- Primarily synchronization, but can coordinate IPC.
- Processes wait/signal on shared semaphores.

**7. Memory-Mapped Files**:
- Map a file into the address space of multiple processes.
- Share both data and persistence.
- Used by databases and IPC frameworks.

**8. Remote Procedure Calls (RPC)** / gRPC:
- Higher-level abstraction over sockets — call remote functions like local ones.
- Used in distributed systems and microservices.

**Comparison**:

| Method | Speed | Complexity | Across network? | Notes |
|--------|-------|------------|-----------------|-------|
| Pipes | Fast | Simple | No | Related processes (anonymous) |
| Named pipes | Fast | Simple | No | Unrelated processes |
| Shared memory | Fastest | Complex | No | Needs sync |
| Message queues | Medium | Medium | No | Structured messages |
| Sockets | Medium | Medium | Yes | Most flexible |
| Signals | Fast | Simple | No | Just notifications |
| Memory-mapped files | Fast | Medium | No | File-based sharing |

**Choosing the right IPC**:
- **Within one machine, high performance** → shared memory + semaphores
- **Client-server on same machine** → Unix domain sockets
- **Across network** → TCP/UDP sockets or gRPC
- **Simple piping of output** → pipes
- **Just notification** → signals

## Real-World Example
**Chrome's multi-process architecture**: Tabs are separate processes. They communicate with the main process via Mojo (custom IPC framework over Unix domain sockets/shared memory). Renderer processes are sandboxed — can't directly access filesystem; must request via IPC.

**PostgreSQL**: Uses shared memory for the buffer cache across backend processes. Each client connection is a process; they share cached pages via shared memory.

**Unix shell pipes**: \`ls | grep pattern | sort | uniq\` — each command is a separate process. Pipes connect stdout → stdin. Classic anonymous pipe usage.

## Interview Tips
- Know shared memory is fastest but needs synchronization
- Unix domain sockets > TCP for local communication (no TCP overhead)
- Signals are for notification, not data transfer
- Mention Mojo/Binder (Android) for modern IPC frameworks

## Common Follow-up Questions
1. Why is shared memory fastest? (No data copying — processes map same pages)
2. What's the downside of signals? (Limited information, can be lost, tricky reentrancy)
3. When use named pipe vs socket? (Named pipe for simple byte stream; socket for flexibility)`,

    'What is Thrashing': `## Definition
**Thrashing** occurs when a computer's virtual memory subsystem is in a constant state of paging — spending more time swapping pages between RAM and disk than executing actual work. The CPU is mostly idle or busy handling page faults, and system throughput collapses.

## Why It Matters
Thrashing is a real production incident scenario — a server with too many users or too-large working sets can grind to a halt even though the CPU is "idle." Understanding it helps diagnose mysterious slowdowns and design capacity planning.

## Detailed Explanation

**How thrashing occurs**:

1. Too many processes are running, each needing its working set in RAM
2. Total working set size exceeds available physical memory
3. Pages must be swapped to disk to make room
4. When a process tries to execute, its pages are on disk → page fault
5. Loading a page requires evicting another page, possibly one that's about to be used
6. The newly-evicted page causes another page fault moments later
7. The system spends nearly all time swapping — almost no useful work done

**Symptoms**:
- CPU utilization suddenly drops (looks idle)
- Disk I/O is maxed out (swap activity)
- System becomes unresponsive
- Processes make very slow progress
- Paradoxically, CPU usage **decreases** as load increases

**Working Set Model (Denning)**:
- A process's **working set** is the set of pages it actively uses at any moment
- If all working sets fit in RAM → no thrashing
- If Σ(working sets) > RAM → thrashing
- OS tries to keep each process's working set resident

**Why it's counterintuitive**: You'd expect adding more processes to fully utilize CPU. Instead, CPU drops. Explanation: processes block on page faults, so CPU has no ready work even though many processes exist.

**Causes**:
- Running too many processes
- One process with a huge working set
- Memory leak growing working set over time
- Insufficient RAM for the workload

**Solutions**:

**1. Reduce multiprogramming level**:
- Suspend some processes (swap them out entirely)
- Don't allow new processes until memory pressure drops

**2. Working Set algorithm**:
- OS tracks each process's working set via recent references
- Only admit processes whose working set fits

**3. Page Fault Frequency (PFF)**:
- Monitor each process's page fault rate
- If too high → give it more frames
- If too low → take some frames away

**4. Local vs Global page replacement**:
- **Global**: Any process can evict any other's pages → one process can cause another to thrash
- **Local**: Process only evicts its own pages → isolation, reduced cross-contamination

**5. Add more RAM** (the obvious hardware fix)

**Avoidance in practice**:
- OS admission control (Linux OOM killer as last resort)
- Container memory limits (cgroups)
- Application-level caching tuning
- Monitoring: if paging activity (\`vmstat si/so\`) is high, investigate

## Real-World Example
**Java OutOfMemoryError** or aggressive GC when heap > RAM: The JVM's GC walks live objects, causing many page references. If heap exceeds RAM, GC triggers thrashing — system may appear frozen for minutes.

**Database server with too many connections**: Each connection holds working memory. Too many concurrent queries → working set too large → thrashing.

**Server rightsizing**: Running 8GB workload on 4GB RAM = thrashing. Either add RAM, or limit concurrency (e.g., connection pool size).

## Interview Tips
- Key insight: "CPU paradoxically drops as load rises"
- Know the working set concept — primary prevention mechanism
- Connect to modern systems: containers with memory limits prevent thrashing
- OOM killer is the last-resort solution in Linux

## Common Follow-up Questions
1. How do you detect thrashing? (High page fault rate, high swap I/O, low CPU utilization)
2. What's the difference between working set and resident set? (Working set: actively used. Resident set: currently in RAM.)
3. Why does reducing multiprogramming help? (Fewer processes → smaller total working set → fits in RAM)`,

    'File Systems Inodes': `## Definition
A **file system** organizes how data is stored and retrieved on disk. An **inode** (index node) is a data structure in Unix-like file systems that stores metadata about a file — everything except the file's name and actual data — including permissions, timestamps, size, and pointers to data blocks.

## Why It Matters
Understanding inodes explains how Unix file systems work under the hood — hard links, permissions, why "no space left on device" can happen even with free space, and how modern file systems scale.

## Detailed Explanation

**Inode contents** (what it stores):
- **File type** (regular, directory, symlink, device)
- **Permissions** (rwx for owner/group/others)
- **Owner UID and group GID**
- **Size** in bytes
- **Timestamps**: access (atime), modify (mtime), change (ctime)
- **Link count** (how many directory entries reference this inode)
- **Pointers to data blocks**: direct, indirect, double indirect, triple indirect

**What inodes DON'T store**:
- **The filename** — that's in the directory entry (dirent)
- **The file's contents** — those are in data blocks

**How a file is accessed**:
1. User says "open /home/user/file.txt"
2. OS walks the path: reads / directory → finds "home" entry → gets its inode → reads home directory → finds "user" → ... → finally finds "file.txt" entry → gets its inode number
3. Reads the inode to get metadata and data block pointers
4. Reads the actual data blocks

**Data block pointers** (traditional Unix design):
- **12 direct pointers**: Point directly to data blocks (fast for small files)
- **1 single indirect**: Points to a block that contains pointers to data blocks
- **1 double indirect**: Points to a block of pointers to blocks of pointers
- **1 triple indirect**: Another level deeper

This structure allows small files to be accessed quickly (direct pointers) while supporting very large files.

**Why filename is separate**:
- **Hard links**: Multiple filenames can point to the SAME inode. \`ln file1 file2\` makes file2 another name for the same inode. Link count increments. When link count drops to 0, inode (and data) is freed.
- **Rename is cheap**: Just changes the directory entry, not the file.

**Inode exhaustion**: File systems are formatted with a fixed number of inodes. You can run out of inodes even with disk space remaining (typical with many small files). Check with \`df -i\`.

**File system components**:
- **Superblock**: Overall FS metadata (size, block size, free block count)
- **Inode table**: Array of inodes
- **Data blocks**: Actual file contents
- **Directory entries**: Map names to inode numbers
- **Journal** (in modern FS): Log of pending changes for crash recovery

**Modern file systems**:
- **ext4** (Linux default): Uses extents instead of indirect blocks for efficiency
- **XFS**: High-performance, scalable
- **Btrfs/ZFS**: Copy-on-write, snapshots, integrated RAID
- **APFS** (macOS): Container-based, snapshots
- **NTFS** (Windows): Master File Table (similar role to inode table)

**Journaling**: Most modern FS write planned changes to a journal before applying them. If the system crashes, the journal is replayed to restore consistency. Trades some performance for reliability.

## Real-World Example
**Hard link example**:
\`\`\`
ls -li file1       # inode 12345, link count 1
ln file1 file2     # link count → 2
ls -li file2       # same inode 12345
rm file1           # link count → 1, file still accessible via file2
rm file2           # link count → 0, inode freed
\`\`\`

**Inode exhaustion**: A log directory with millions of tiny files might use all inodes even if only 1% of disk space is used. \`df -i\` shows 100% inode usage but \`df\` shows plenty of space. Solution: delete small files or reformat with more inodes.

## Interview Tips
- Know that filename is in the directory, NOT in the inode
- Hard link mechanics — shows understanding of inode/dirent separation
- Inode exhaustion is a real production gotcha
- Mention journaling as a crash-consistency mechanism

## Common Follow-up Questions
1. Hard link vs symbolic link? (Hard: same inode. Symlink: separate file pointing to path — can break if target moved)
2. Why can't hard links span filesystems? (Inodes are per-FS — inode 12345 means different things in different FS)
3. What's a journaling file system? (Writes a log of changes before applying — crash-safe)`,

    'System Calls': `## Definition
A **system call (syscall)** is a request a user-space program makes to the OS kernel to perform a privileged operation — like reading a file, creating a process, or allocating memory. System calls are the controlled gateway between user programs and kernel services.

## Why It Matters
Everything a program does that affects the outside world — file I/O, network, process creation, memory mapping — goes through system calls. Understanding them explains the user/kernel boundary, performance costs, and why some operations are expensive.

## Detailed Explanation

**Why system calls exist**:
- User programs run in **user mode** with limited privileges (can't directly access hardware, memory outside their space, or other processes)
- Kernel runs in **kernel mode** with full hardware access
- System calls are the CONTROLLED way to request kernel services without breaking isolation

**How a system call works (roughly)**:
1. User program calls a library function (e.g., \`read()\`)
2. Library puts syscall number and arguments in registers
3. Executes a special instruction (\`syscall\` on x86-64 Linux, \`int 0x80\` on older x86)
4. CPU switches from user mode to kernel mode (context switch, but within same process)
5. Kernel looks up the syscall number in the syscall table
6. Kernel validates arguments, performs the operation
7. Kernel switches back to user mode, returns the result
8. User program continues

**Common system calls**:

**Process management**:
- \`fork()\`: Create child process
- \`exec()\`: Replace process image
- \`wait()\`: Wait for child to finish
- \`exit()\`: Terminate process

**File I/O**:
- \`open()\`: Open a file (returns file descriptor)
- \`read()\`: Read from a file
- \`write()\`: Write to a file
- \`close()\`: Close a file descriptor
- \`lseek()\`: Reposition file pointer

**Memory**:
- \`mmap()\`: Map memory (file or anonymous)
- \`brk()/sbrk()\`: Adjust heap size
- \`munmap()\`: Unmap memory

**Networking**:
- \`socket()\`: Create socket
- \`connect()\`, \`bind()\`, \`listen()\`, \`accept()\`: Socket setup
- \`send()\`, \`recv()\`: Network I/O

**IPC**:
- \`pipe()\`: Create pipe
- \`kill()\`: Send signal
- \`shmget()\`, \`shmat()\`: Shared memory

**Cost of a system call**:
- **Mode switch** (user → kernel → user): ~100 nanoseconds each way
- **Register save/restore**
- **Kernel validation** of arguments
- **Cache/TLB disturbance**

Typical syscall: 100–1000 nanoseconds. Not free — chatty syscall-heavy code is slow.

**Library function vs syscall**:
- \`printf\` is a library function that buffers and eventually calls \`write\` syscall
- \`malloc\` is library; may call \`brk\` or \`mmap\` syscalls when expanding heap
- \`strcpy\` is purely user-space — no syscall

**Reducing syscall overhead**:
- **Buffering**: One big \`write()\` is cheaper than 1000 small ones (stdio does this)
- **Batching**: \`sendmmsg()\` sends multiple messages in one call
- **Async I/O**: \`io_uring\` (modern Linux) reduces syscall overhead for high-throughput servers
- **vDSO**: Some syscalls (\`gettimeofday\`) are redirected to user-space for speed

**Checking syscalls**:
- Linux: \`strace ./program\` shows every syscall the program makes
- Great debugging tool — reveals what a black-box program is doing

## Real-World Example
**Tight loop of \`write(fd, buf, 1)\`** (one byte at a time) vs **one \`write(fd, buf, 10000)\`** — the latter is orders of magnitude faster because of syscall overhead. This is why buffered I/O (\`fprintf\`) outperforms unbuffered.

**Web servers**: Modern high-performance servers (Nginx, Node.js) minimize syscalls with epoll/kqueue/io_uring — handling thousands of connections with few syscalls per connection.

**Docker containers**: Seccomp filters limit which syscalls containers can make — security sandbox.

## Interview Tips
- Know the user/kernel mode boundary — that's what syscalls cross
- \`strace\` is a great tool to mention
- Syscall cost (~microsecond) — helps explain why certain optimizations matter
- Modern interfaces (io_uring) reduce syscall overhead

## Common Follow-up Questions
1. Function call vs system call? (Function is user-space; syscall crosses into kernel)
2. Why is syscall expensive? (Mode switch, register saves, cache pollution)
3. What's vDSO? (Kernel exposes some fast syscalls as user-space code to avoid mode switch)`,

    'Kernel vs User Space': `## Definition
**Kernel space** is the protected memory area where the operating system kernel executes with full hardware privileges. **User space** is the memory area where user applications run with restricted privileges. The CPU enforces this separation through hardware protection rings or privilege levels.

## Why It Matters
This separation is the bedrock of modern OS security and stability. It prevents user programs from crashing the system or reading others' data. Understanding it explains segfaults, security models, and why certain operations require special interfaces.

## Detailed Explanation

**CPU privilege levels**:
- **x86/x64**: Four rings (0-3). Kernel uses Ring 0; user programs use Ring 3. Rings 1-2 are unused in most OSes.
- **ARM**: Exception levels (EL0-EL3). User at EL0; kernel at EL1.

Hardware enforces: certain instructions (halt CPU, modify page tables, access I/O ports) can ONLY be executed in privileged mode. User-mode code attempting them triggers a fault.

**Kernel space**:
- **Full access** to all memory, devices, CPU instructions
- **Manages** processes, memory, I/O, scheduling
- **Trusted code** — a bug here can crash the entire system (kernel panic / Blue Screen of Death)
- **Shared**: All processes share the kernel. Kernel memory is mapped into every process's address space but protected from user access.

**User space**:
- **Restricted privileges** — can't access hardware directly
- **Isolated**: Each process has its own virtual address space
- **Untrusted**: A crash affects only that process, not the whole system
- **Must use syscalls** to request kernel services

**Memory layout** (Linux, typical):
\`\`\`
0xFFFFFFFF ┌─────────────────┐
           │  Kernel space   │  (high addresses, shared)
0xC0000000 ├─────────────────┤
           │  Stack          │  grows down
           │      ↓          │
           │                 │
           │      ↑          │
           │  Heap           │  grows up
           │  BSS            │
           │  Data           │
           │  Text (code)    │
0x00000000 └─────────────────┘
\`\`\`

**Transitions**:
- **User → Kernel**: Via system call, interrupt, or exception
- **Kernel → User**: When syscall returns, or when kernel schedules a user process

**Why the separation**:

**1. Security**: User program can't directly modify kernel data or other processes' memory.

**2. Stability**: A buggy user program crashes itself, not the kernel.

**3. Resource arbitration**: Kernel decides who gets CPU time, memory, I/O — user programs can't hoard.

**4. Abstraction**: User code uses simple APIs (\`read\`, \`write\`); kernel handles hardware details.

**Key kernel subsystems**:
- **Process scheduler**: Who runs next
- **Memory manager**: Page tables, swap, allocation
- **File systems**: VFS layer + specific FS implementations
- **Network stack**: TCP/IP, sockets
- **Device drivers**: Hardware abstractions
- **Security**: Access control, capabilities

**Kernel architectures**:
- **Monolithic kernel** (Linux): All kernel services in one address space. Fast, but one bug can crash everything.
- **Microkernel** (Minix, QNX): Minimal kernel; most services (drivers, FS) run in user space. More stable but slower due to IPC overhead.
- **Hybrid** (Windows NT, macOS XNU): Middle ground.

**User space access attempts**:
- Accessing kernel memory from user program → **segmentation fault** (hardware-detected)
- Executing privileged instruction → **general protection fault**

## Real-World Example
**Linux kernel panic vs user segfault**: Your Python script crashes → just Python exits, OS fine. A driver bug in kernel space → kernel panic, whole machine freezes or restarts.

**Segmentation fault when dereferencing NULL**: Address 0x0 is typically unmapped in user space. Accessing it → hardware triggers page fault → kernel sees no mapping → sends SIGSEGV → process dies.

**Virtualization**: VMs run guest kernels in "Ring 1" or similar — kernels think they're in Ring 0, but hypervisor (Ring 0 on host) intercepts privileged operations.

## Interview Tips
- Know that the CPU enforces this via rings (hardware-level, not software)
- Kernel crash = system crash; user crash = one program down
- Syscalls are the bridge between user and kernel
- Monolithic vs microkernel trade-offs (Linux vs Minix)

## Common Follow-up Questions
1. What's a kernel panic? (Kernel encounters unrecoverable error — system halts)
2. Microkernel vs monolithic? (Stability vs performance)
3. Why can't user programs directly talk to hardware? (Security, arbitration — kernel ensures fairness)`,

    'What is Kernel': `## Definition
The **kernel** is the core of an operating system — the lowest-level software that has direct control over hardware and provides fundamental services (process scheduling, memory management, device I/O, file systems) to all other software. It's the first code loaded after the bootloader and runs until the system shuts down.

## Why It Matters
Understanding what the kernel does and its architecture types explains OS fundamentals, performance trade-offs, and why Linux vs Windows vs macOS behave differently.

## Detailed Explanation

**Core kernel responsibilities**:

**1. Process management**: Create, schedule, terminate processes. Handle context switching. Provide IPC.

**2. Memory management**: Allocate/deallocate memory, virtual memory, paging, swap.

**3. Device management**: Drivers for hardware — disks, network cards, GPUs, USB. Expose a uniform device abstraction.

**4. File systems**: Organize disk storage, provide file operations.

**5. Security**: Access control, permissions, user isolation.

**6. Networking**: TCP/IP stack, sockets, packet routing.

**Three main kernel architectures**:

**1. Monolithic Kernel**:
- ALL services (scheduler, drivers, FS, network) in one address space, one binary
- Fast — direct function calls within kernel
- Large — Linux kernel is ~30M lines of code
- Bug in any part can crash entire kernel
- **Examples**: Linux, traditional Unix, BSD

**2. Microkernel**:
- Only the most essential services in the kernel (IPC, basic scheduling, minimal memory management)
- Drivers, file systems, network stack run as SEPARATE USER-SPACE services
- More stable — driver crash doesn't kill the kernel
- Slower — inter-service communication requires IPC overhead
- **Examples**: Minix, QNX, L4, Mach (Apple's foundation)

**3. Hybrid Kernel**:
- Combines monolithic and microkernel ideas
- Core services in kernel space for performance, some in user space for stability
- **Examples**: Windows NT (and descendants: XP, 7, 10, 11), macOS (XNU = Mach + BSD monolithic components)

**4. Exokernel / Unikernel** (niche):
- Extreme minimalism — kernel just multiplexes hardware
- Applications bring their own "library OS"
- Used for specialized high-performance or cloud scenarios

**Kernel components (Linux example)**:
- **Scheduler** (CFS): Decides which process runs next
- **Memory subsystem**: Page tables, slab allocator, page cache
- **VFS (Virtual File System)**: Abstract layer; concrete FS (ext4, xfs, btrfs) plug in
- **Network stack**: Socket, TCP, UDP, IP, routing
- **Drivers**: Character devices, block devices, network devices
- **Security modules**: SELinux, AppArmor, capabilities

**Boot sequence** (simplified):
1. **BIOS/UEFI** — hardware self-test, loads bootloader from disk
2. **Bootloader** (GRUB, LILO) — loads kernel image into memory
3. **Kernel initialization**: Sets up memory, detects hardware, loads drivers
4. **Init process** (systemd, init): First user-space process (PID 1)
5. **System services**: Launch drivers, daemons, login manager

**Kernel modules** (Linux): Kernel components that can be loaded/unloaded at runtime without rebooting — useful for drivers. \`modprobe\`, \`insmod\`, \`lsmod\`.

**Kernel space vs user space**: The kernel runs in a privileged CPU mode (kernel mode / ring 0). User programs run with restricted privileges and must use syscalls to request services.

## Real-World Example
**Linux kernel**: Monolithic, but with loadable modules. Used by Android, servers, embedded systems. Huge ecosystem.

**Windows NT kernel**: Hybrid architecture — some components run in kernel mode (scheduler, memory manager), others in user mode (subsystems like Win32).

**macOS XNU kernel**: Hybrid — Mach microkernel at the foundation, with BSD monolithic components for FS and networking. Drivers use I/O Kit.

**QNX**: True microkernel — used in cars (BMW, Ford), medical devices, military systems where reliability is paramount.

## Interview Tips
- Know the three main architectures and their trade-offs
- Linux is monolithic with modules — common misconception is "Linux is a microkernel"
- Windows and macOS are hybrids — neither purely monolithic nor microkernel
- The 1992 Torvalds-Tanenbaum debate is legendary (monolithic vs microkernel) — fun anecdote

## Common Follow-up Questions
1. Why are monolithic kernels faster? (Direct function calls, no IPC)
2. Why use microkernels then? (Stability, security — failures are isolated)
3. What's a loadable kernel module? (Code loaded into kernel space at runtime without reboot)`,

    'Page Replacement': `## Definition
**Page replacement** is the OS algorithm deciding which page to evict from RAM to make room for a new one when a page fault occurs and memory is full. The choice significantly impacts system performance — a good algorithm evicts pages unlikely to be used soon.

## Why It Matters
Page replacement directly affects page fault rates and thus system throughput. It's a classic OS algorithms topic in interviews, testing both theoretical understanding (Belady's anomaly) and practical knowledge (LRU variants used in production).

## Detailed Explanation

**Common page replacement algorithms**:

**1. FIFO (First-In, First-Out)**:
- Evict the page that's been in memory longest
- Simple — just use a queue
- **Problem**: Can evict frequently-used pages just because they were loaded first
- **Belady's anomaly**: Adding MORE frames can INCREASE page faults (counterintuitive!)

**2. Optimal (OPT / Belady's algorithm)**:
- Evict the page that won't be used for the longest time in future
- **Theoretically optimal** — minimum page faults
- **Impossible in practice** — requires knowing the future
- Used as a benchmark to compare other algorithms

**3. LRU (Least Recently Used)**:
- Evict the page that hasn't been used for the longest time
- Approximates Optimal assuming recent past predicts near future
- Generally excellent performance — close to Optimal in practice
- **Implementation cost**: Tracking exact "last used" time is expensive

**4. LRU Approximations** (used in real OSes):

**Clock algorithm (Second-chance)**:
- Each page has a "reference" bit
- Scan circularly; if ref=1, clear it and skip. If ref=0, evict.
- Approximates LRU with low overhead
- Linux uses a variant of this

**NFU (Not Frequently Used)** / **Aging**:
- Each page has a counter; periodically incremented if referenced, shifted right
- Counter reflects recent usage (with bias toward recent)

**5. LFU (Least Frequently Used)**:
- Evict the page with the lowest reference count
- **Problem**: Old, once-heavily-used pages are hard to evict even if no longer needed
- **Solution**: Aging — decay counters over time

**6. Random**:
- Pick a random page
- Surprisingly not terrible; simple and cache-oblivious
- Sometimes used in caches and hardware

**Belady's Anomaly (for FIFO)**:
With reference string \`1,2,3,4,1,2,5,1,2,3,4,5\`:
- 3 frames: 9 page faults
- 4 frames: 10 page faults  (more frames, more faults!)

Demonstrates FIFO is **not a stack algorithm** — doesn't satisfy the inclusion property. LRU and OPT don't suffer from this anomaly.

**Stack algorithms**: Algorithms where the set of pages in N frames is ALWAYS a subset of the set in N+1 frames. LRU and OPT are stack algorithms — immune to Belady's anomaly.

**Local vs Global replacement**:
- **Local**: A process can only evict its own pages → each process has a stable frame allocation
- **Global**: Any page can be evicted → more flexible but one process can hurt others

**Working Set Model**:
- Track the set of pages each process has used recently
- Ensure all processes' working sets fit in memory → prevents thrashing
- Combined with replacement policies

## Real-World Example
**Linux kernel**: Uses a modified Clock algorithm with two lists (active and inactive). Pages are promoted/demoted between lists based on access. Much simpler than true LRU but effective.

**Database buffer pools**: Often implement LRU or variants (like MySQL's adaptive LRU with midpoint insertion) to cache hot pages in memory.

**Browser caches**: Use LRU to decide what to keep in memory vs evict when memory is tight.

## Interview Tips
- Know OPT is the theoretical best, LRU approximates it, FIFO is simple but flawed (Belady's anomaly)
- Belady's anomaly is a classic question — be ready to explain with an example
- Real OSes use Clock or variants, not pure LRU (too expensive)
- LFU with aging is a good real-world answer

## Common Follow-up Questions
1. What's Belady's anomaly? (FIFO can have more faults with more frames)
2. Why not use true LRU in OSes? (Expensive to track exactly — needs timestamp per access)
3. LRU vs LFU? (Recency vs frequency — different workload fits)`,

    'Zombie Process': `## Definition
A **zombie process** is a child process that has completed execution but still has an entry in the process table because its parent hasn't yet read its exit status. It holds no memory or resources other than the PCB entry — it's "dead but not buried."

## Why It Matters
Zombies are a common source of bugs in multi-process programs. Too many can exhaust PID space and prevent new processes from starting. Understanding them reveals how Unix process lifecycle works.

## Detailed Explanation

**Process lifecycle**:
1. **Created**: \`fork()\` creates child
2. **Running/Sleeping**: Normal execution
3. **Terminated**: Process calls \`exit()\` or receives fatal signal
4. **Zombie**: Has exited but parent hasn't called \`wait()\`
5. **Reaped**: Parent calls \`wait()\`, gets exit status, zombie is removed

**Why zombies exist**:
When a process exits, the OS can't immediately delete its PCB because the parent might need to check:
- Exit status (success/failure, exit code)
- Resource usage
- Signal information

So the OS keeps minimal info until the parent "reaps" it via \`wait()\` or \`waitpid()\`.

**Identifying zombies**:
- \`ps aux\` shows zombies with state "Z" or "<defunct>"
- PID exists but process consumes no CPU/memory

**Why zombies are a problem**:
- **PID exhaustion**: Each zombie holds a PID; too many → can't fork new processes
- **Process table bloat**: Limited entries in the system

**Causes of zombie processes**:
1. **Parent forgets to call \`wait()\`**: Most common bug
2. **Parent is slow**: Temporary zombies during brief lag (normal, usually reaped quickly)
3. **Bugs where SIGCHLD isn't handled properly**

**Handling zombies in code**:

**Method 1 — \`wait()\` explicitly**:
\`\`\`c
pid_t pid = fork();
if (pid == 0) { /* child */ }
else { wait(NULL); /* parent waits, reaps */ }
\`\`\`

**Method 2 — Handle SIGCHLD**:
\`\`\`c
signal(SIGCHLD, SIG_IGN);  // tell OS we don't care → auto-reap
// OR
signal(SIGCHLD, handler);  // reap in signal handler
\`\`\`

**Method 3 — Double fork**:
\`\`\`c
if (fork() == 0) {
  if (fork() == 0) {
    // grandchild — do work
    exit(0);
  }
  exit(0);  // child exits immediately
}
wait(NULL);  // parent reaps middle child
// grandchild is orphaned → adopted by init → init reaps on grandchild's exit
\`\`\`

**Killing a zombie**: You can't — it's already dead! You must:
- Get the parent to \`wait()\` for it
- Kill the parent (orphaning zombie → adopted by init → init reaps it)

**Related concept — Orphan process**:
If the PARENT dies before the child, the child becomes an **orphan**. It's NOT a zombie — just has no parent. The init process (PID 1) adopts orphans and waits for them, so they never become lasting zombies.

**Zombie vs Orphan**:
- **Zombie**: Child dies, parent lives but ignores it
- **Orphan**: Parent dies, child lives → reparented to init

## Real-World Example
**Web servers forking child processes**: If the server doesn't reap children, each request creates a lingering zombie. Eventually — boom, no more forks possible, server hangs.

**Simple Apache bug pattern** (hypothetical): If the SIGCHLD handler has a bug and doesn't reap, zombies accumulate. Administrator sees CPU fine, memory fine, but new connections fail. \`ps aux | grep defunct\` reveals thousands of zombies.

**Shell background jobs**: When you run \`./script &\`, the shell tracks the PID. When the script exits, it becomes a zombie until the shell prints its completion status and reaps.

## Interview Tips
- Clearly distinguish zombie (dead, parent ignores) from orphan (alive, parent died)
- Know you can't kill a zombie — it's already dead
- SIGCHLD and \`wait()\` are the canonical solutions
- Mention double-fork for detaching daemons

## Common Follow-up Questions
1. Difference between zombie and orphan? (Child dead parent alive vs parent dead child alive)
2. How to prevent zombies? (\`wait()\`, SIGCHLD handler, or \`signal(SIGCHLD, SIG_IGN)\`)
3. What's the double-fork idiom for? (Create truly detached daemon processes)`,

    'Orphan Process': `## Definition
An **orphan process** is a running process whose parent has terminated before it. In Unix-like systems, orphans are automatically adopted by the init process (PID 1), which becomes their new parent. Orphans continue running normally — being an orphan is usually not a problem.

## Why It Matters
Orphans are often confused with zombies. Understanding the distinction is important for interviews and for designing daemon processes that deliberately become orphans to detach from their parent shell.

## Detailed Explanation

**How orphans occur**:
1. Parent creates child via \`fork()\`
2. Parent exits (either normally or crashes)
3. Child is still running → becomes an orphan
4. Kernel notices the orphan — reassigns its parent to init (PID 1)
5. When child eventually exits, init automatically reaps it (preventing zombie state)

**Why init adopts orphans**:
- Every process must have a parent to receive its exit status (to prevent permanent zombies)
- init is guaranteed to always be running — it's the root of the process tree
- init is specifically designed to reap children (calls \`wait()\` regularly)

**Checking orphan's parent**:
\`\`\`bash
ps -o pid,ppid,cmd
# orphaned processes show PPID=1
\`\`\`

**Orphan is usually benign**:
- Process keeps running
- Gets its I/O, memory, CPU as normal
- Init handles the cleanup when it exits
- No resource leak, no accumulating state

**Intentional orphaning — daemons**:
Daemons (background system services like \`httpd\`, \`sshd\`) are often designed to deliberately become orphans:
1. They're started from a shell
2. They fork a child
3. The parent (shell-connected) exits
4. The child becomes orphaned → adopted by init → now a proper background service disconnected from the terminal

**Classic daemonization steps**:
1. \`fork()\` — create child
2. Parent exits → child is orphan, adopted by init
3. Child calls \`setsid()\` to create new session (detach from terminal)
4. \`fork()\` again (double fork) — ensures no controlling terminal can ever be acquired
5. \`chdir("/")\`, close stdin/stdout/stderr, redirect to /dev/null
6. Now it's a proper daemon

**Modern systems**: systemd manages daemons differently — doesn't require double-fork. But the orphan mechanism still underlies it.

**Related concept — Zombie**:
- **Orphan**: Parent dead, child alive. Benign (adopted by init).
- **Zombie**: Parent alive but hasn't reaped; child is dead. Problematic.

**Distinguishing orphan from zombie**:

| Feature | Orphan | Zombie |
|---------|--------|--------|
| Child state | Running | Terminated |
| Parent state | Dead | Alive but not waiting |
| New parent | init | Original (still alive) |
| Resource usage | Normal | Just PCB entry |
| Problematic? | No (init handles it) | Yes (PID leak) |
| How resolved | Continues then exits → init reaps | Parent must \`wait()\` |

## Real-World Example
**SSH disconnection**: You start a long-running script, then close SSH. Normally, the shell sends SIGHUP to children and they die. With \`nohup\` or \`disown\`, the script ignores SIGHUP. When the SSH session ends, the shell exits — script becomes an orphan adopted by init. It continues running.

**Running background jobs**: \`./long_script.sh &\` then closing terminal → the script is orphaned. \`nohup\` or \`disown\` makes this robust against hangup signals.

**Docker containers**: If a container's PID 1 dies (the main process), the container exits. All other processes in it are killed. Inside a container, proper init handling matters — use \`tini\` or \`dumb-init\` to avoid zombie problems.

## Interview Tips
- Crystal clear distinction from zombies: orphan = alive, zombie = dead
- init (PID 1) adopts orphans — classic Unix behavior
- Daemonization uses orphaning intentionally
- Mention modern alternatives: systemd handles this differently

## Common Follow-up Questions
1. Why is orphan not a problem? (init adopts and reaps it)
2. Can orphans become zombies? (Only briefly — init reaps immediately)
3. What's the daemonization process? (Fork, parent exits, child setsid, often double-fork)`,

    'Race Condition': `## Definition
A **race condition** is a bug in concurrent code where the program's correctness depends on the timing or interleaving of multiple threads/processes accessing shared resources. Different runs can produce different results, making the bug non-deterministic and hard to reproduce.

## Why It Matters
Race conditions are among the most dangerous bugs in concurrent software — they often pass testing (because the bad timing is rare) but crash in production. Understanding them is essential for writing correct multi-threaded code.

## Detailed Explanation

**Classic example — counter increment**:
\`\`\`
Thread A: counter++;
Thread B: counter++;
\`\`\`
Looks atomic but actually involves three steps:
1. READ counter from memory
2. ADD 1 to the value in register
3. WRITE back to memory

If both threads execute simultaneously:
\`\`\`
A: reads counter = 5
B: reads counter = 5
A: computes 5 + 1 = 6
B: computes 5 + 1 = 6
A: writes 6
B: writes 6
\`\`\`
Result: counter = 6 (should be 7!). One increment lost.

**Critical sections**: A piece of code that accesses shared data and must NOT be executed by more than one thread at a time. Race conditions happen when critical sections aren't properly protected.

**Common types of race conditions**:

**1. Read-modify-write**: As shown above — counter increments, balance updates.

**2. Check-then-act (TOCTOU — Time Of Check to Time Of Use)**:
\`\`\`
if (file_exists(path)) {
  // Another thread deletes the file here
  open(path);  // FAILS
}
\`\`\`
Classic security vulnerability — checking permissions then using resource, with a gap in between.

**3. Initialization races**: Two threads try to initialize a shared singleton simultaneously.

**4. Double-checked locking** (subtle): 
\`\`\`
if (instance == null) {           // check (no lock)
  synchronized {
    if (instance == null) {        // check again (with lock)
      instance = new Singleton();  // can be seen partially-built by other threads without volatile!
    }
  }
}
\`\`\`
Requires \`volatile\` in Java to be correct.

**Solutions**:

**1. Mutual exclusion (locks)**:
\`\`\`
lock.acquire();
counter++;  // safe — only one thread at a time
lock.release();
\`\`\`

**2. Atomic operations**:
Hardware-level indivisible operations (\`AtomicInteger\`, \`std::atomic\`, CAS instructions).
\`\`\`
atomicCounter.incrementAndGet();  // hardware-atomic, no race
\`\`\`

**3. Immutability**: Can't have races on data that never changes. Functional programming languages lean on this heavily.

**4. Thread-local storage**: Each thread has its own copy — no sharing, no race.

**5. Message passing**: Don't share memory; pass messages instead (Erlang, Go channels, Actor model).

**Detection tools**:
- **Static analysis**: Compilers/linters detect obvious patterns
- **Dynamic analysis**: ThreadSanitizer (C/C++), Go's race detector, Java's JCStress — run code under instrumentation to detect races at runtime
- **Formal verification**: Model checkers like TLA+ prove absence of races in critical systems

**Related concepts**:
- **Data race**: Specifically, concurrent access to memory with at least one write, without synchronization. Undefined behavior in C/C++/Java memory models.
- **Deadlock**: Different issue — threads stuck waiting. Often a consequence of trying to prevent races poorly.
- **Livelock**: Threads active but making no progress.

## Real-World Example
**Therac-25 incident (1985-87)**: Radiation therapy machine had race conditions causing massive radiation overdoses. Killed at least 3 patients, severely injured several. The bug was a race between user input and machine state — if you typed fast enough, unsafe mode could be active. Classic tragedy of race conditions in safety-critical systems.

**Banking without locks**: Two ATMs simultaneously withdrawing from the same account. Without proper locking, both succeed even if only one should (total withdrawal exceeds balance). Result: overdraft and data corruption.

**Modern bug example — Meltdown/Spectre**: CPU speculative execution caused information leaks across security boundaries — kind of a hardware race condition on privileged data.

## Interview Tips
- Always give the counter example — it's the clearest
- Distinguish data race (undefined behavior) from general race condition (incorrect behavior)
- Mention ThreadSanitizer / Go's race detector — modern testing tools
- Atomic operations > locks when possible (less overhead, can't forget to release)

## Common Follow-up Questions
1. Race condition vs deadlock? (Incorrectness from timing vs threads stuck waiting)
2. What's TOCTOU? (Check-then-act with a gap — often security vulnerability)
3. How to find races in production code? (Race detectors like ThreadSanitizer, code review, JCStress)`,

    'Reader-Writer': `## Definition
The **Reader-Writer problem** is a classic concurrency synchronization problem: multiple threads need access to a shared resource where readers only read and writers modify. The goal is to allow concurrent reading (since readers don't conflict) but exclusive access for writers (to prevent data corruption).

## Why It Matters
Reader-writer locks are a fundamental optimization for read-heavy workloads — they can dramatically improve throughput over simple mutex locks by allowing multiple readers simultaneously. Used in databases, caches, file systems.

## Detailed Explanation

**The rules**:
1. Multiple readers can access the resource simultaneously (no conflict)
2. Only one writer can access at a time (exclusive)
3. Readers and writers cannot access simultaneously

**Why not just use a mutex**:
A mutex allows only ONE thread at a time — even if all threads only want to read, they serialize. In a read-heavy workload (say, 99% reads), that's a huge bottleneck. Reader-writer locks allow all readers to proceed in parallel.

**The three variants** — different fairness policies:

**1. Reader-Preference (first readers-writers problem)**:
- Readers get priority
- If readers are active, a waiting writer must wait until all readers finish
- New readers can enter even if a writer is waiting
- **Problem**: Writers can STARVE if reads are continuous

**2. Writer-Preference (second readers-writers problem)**:
- Writers get priority
- If a writer is waiting, new readers must wait
- Existing readers finish, then writer gets in
- **Problem**: Readers can starve if writes are frequent

**3. Fair / FIFO (third readers-writers problem)**:
- Threads served in arrival order
- No starvation
- Slightly slower but predictable

**Classic implementation (reader preference, using semaphores)**:
\`\`\`
semaphore rw_mutex = 1;     // controls write exclusivity
semaphore mutex = 1;         // protects read_count
int read_count = 0;

Reader:
  mutex.wait();
  read_count++;
  if (read_count == 1) rw_mutex.wait();  // first reader locks out writers
  mutex.signal();
  
  // READ DATA
  
  mutex.wait();
  read_count--;
  if (read_count == 0) rw_mutex.signal();  // last reader allows writers
  mutex.signal();

Writer:
  rw_mutex.wait();
  // WRITE DATA
  rw_mutex.signal();
\`\`\`

**Language-level support**:
- **Java**: \`ReentrantReadWriteLock\`
- **C++**: \`std::shared_mutex\` (C++17)
- **Python**: No built-in, but available in libraries
- **Go**: \`sync.RWMutex\`
- **Rust**: \`RwLock\` in std library

**When to use reader-writer locks**:
- Read-heavy workloads (>80% reads)
- Critical sections where reads are expensive (not just checking a flag)
- Multiple CPU cores available

**When NOT to use**:
- Short critical sections (lock overhead dominates)
- Write-heavy workloads (mutex is simpler and same performance)
- Low contention (no benefit)

**Alternatives**:
- **Copy-on-Write (COW)**: Writers make a full copy; readers see consistent snapshots. No blocking.
- **RCU (Read-Copy-Update)**: Used in Linux kernel — lock-free reading, deferred cleanup
- **Optimistic concurrency**: Read freely; validate before committing writes (databases use this)

## Real-World Example
**Database lock managers**: Row-level locks often distinguish shared (read) and exclusive (write) locks. SELECT queries acquire shared locks — multiple readers coexist. UPDATE/DELETE acquires exclusive.

**File systems**: Inodes and directory structures often use reader-writer locks. Many processes reading the same file is common — all can proceed. Writing is rarer but must be exclusive.

**In-memory caches**: Redis-like caches use reader-writer patterns to allow concurrent reads while updates block briefly.

**Linux kernel RCU**: Incredibly clever — readers NEVER block. Writers create a new copy, swap pointers atomically, and wait for old readers to finish before deleting the old copy.

## Interview Tips
- Know the three fairness variants (reader-pref, writer-pref, fair)
- Starvation is the key downside of unfair policies
- RWLock makes sense only for read-heavy workloads — overhead can hurt otherwise
- Mention language-specific implementations (Java's ReadWriteLock)

## Common Follow-up Questions
1. When does writer starvation happen? (Reader-preference with continuous reads)
2. How does RCU differ? (Readers don't lock at all — writers handle synchronization)
3. What's a shared/exclusive lock in databases? (Same concept — reader/writer locks)`,

    'Producer-Consumer': `## Definition
The **Producer-Consumer problem** is a classic concurrency problem where one or more producer threads generate data and put it into a buffer, while one or more consumer threads remove and process data from the buffer. The challenge: coordinate access so the buffer isn't overfilled (producers wait when full) or underdrained (consumers wait when empty), and access doesn't race.

## Why It Matters
Producer-consumer is the foundation of queues, pipelines, thread pools, event-driven architectures, and messaging systems (Kafka, RabbitMQ). Understanding the synchronization pattern is essential for building concurrent systems.

## Detailed Explanation

**The scenario**:
- **Shared bounded buffer** (size N)
- **Producers** add items to the buffer
- **Consumers** remove items
- **Rules**: Buffer can't go below 0 or above N; no concurrent modifications corrupt the buffer

**Naive (broken) approach — without synchronization**:
\`\`\`
// Producer
while (buffer is full) wait;
buffer[tail++] = item;

// Consumer
while (buffer is empty) wait;
item = buffer[head++];
\`\`\`
Multiple issues: busy-waiting wastes CPU, race conditions on tail/head, buffer full/empty checks race.

**Classic solution using semaphores**:
\`\`\`
semaphore mutex = 1;      // protects buffer access
semaphore empty = N;       // counts empty slots (producer waits on this)
semaphore full = 0;        // counts filled slots (consumer waits on this)

// Producer
empty.wait();              // wait for empty slot
mutex.wait();              // exclusive buffer access
buffer.add(item);
mutex.signal();
full.signal();             // signal consumer: one more item

// Consumer
full.wait();               // wait for filled slot
mutex.wait();
item = buffer.remove();
mutex.signal();
empty.signal();            // signal producer: one more slot
\`\`\`

**Why two semaphores** (\`empty\` and \`full\`):
- \`empty\` tracks space for producers
- \`full\` tracks items for consumers
- \`mutex\` ensures only one thread modifies buffer at a time

**Key invariant**: \`empty + full == N\` always.

**Common pitfalls**:
- **Deadlock**: If mutex is acquired before empty/full semaphores, producer could hold mutex while waiting for empty — blocking consumers from releasing space
- **Lost signals**: If you signal before a matching wait, it's counted correctly with semaphores (semaphore counts accumulate) — but simpler "condition variables" can lose signals without careful handling

**Alternative with monitors (condition variables)**:
\`\`\`java
synchronized (buffer) {
  while (buffer.isFull()) buffer.wait();  // wait on condition
  buffer.add(item);
  buffer.notifyAll();  // wake consumers
}

synchronized (buffer) {
  while (buffer.isEmpty()) buffer.wait();
  item = buffer.remove();
  buffer.notifyAll();  // wake producers
}
\`\`\`

**Variants**:
- **Single producer, single consumer (SPSC)**: Can be implemented lock-free with atomic operations — very fast
- **Multiple producers, multiple consumers (MPMC)**: Requires locks or complex lock-free algorithms
- **Bounded buffer**: Fixed size (needs waiting when full/empty)
- **Unbounded buffer**: Only consumers wait (on empty) — producers never block

**Modern implementations**:
- **Java \`BlockingQueue\`**: Ready-to-use producer-consumer. Variants: \`ArrayBlockingQueue\`, \`LinkedBlockingQueue\`, \`PriorityBlockingQueue\`.
- **Go channels**: First-class language feature. \`ch <- value\` blocks if full; \`<- ch\` blocks if empty.
- **Disruptor pattern (LMAX)**: Ring buffer for extreme performance — used in high-frequency trading.

## Real-World Example
**Thread pools**: Worker threads are consumers; incoming tasks are what producers add to a work queue. \`ExecutorService\` in Java is exactly this.

**Web servers**: Request handlers (producers) put requests into a queue; worker threads (consumers) process them. Decouples request acceptance from processing.

**Print spooler**: Applications (producers) send print jobs; printer daemon (consumer) processes them. Classic example from textbooks.

**Streaming pipelines**: Kafka is producer-consumer at scale — producers publish events, consumer groups process them, with persistence and partitioning.

## Interview Tips
- Memorize the three-semaphore solution (mutex, empty, full)
- Order matters: wait on resource semaphores BEFORE mutex (avoid deadlock)
- Know when semaphores vs condition variables — both work, different APIs
- Mention modern constructs (BlockingQueue, Go channels)

## Common Follow-up Questions
1. What happens if you acquire mutex before empty semaphore? (Deadlock risk)
2. Difference between semaphores and condition variables? (Semaphore has a count; CV needs external state check in a while loop)
3. How to handle multiple producers/consumers? (Same pattern scales — the semaphores handle arbitrary N)`,

    'Dining Philosophers': `## Definition
The **Dining Philosophers Problem** is a classic synchronization problem proposed by Edsger Dijkstra in 1965. Five philosophers sit at a round table with bowls of spaghetti. Between each pair of adjacent philosophers is a single fork. To eat, a philosopher needs BOTH the left and right fork. The challenge: design a protocol so philosophers don't deadlock or starve.

## Why It Matters
Dining Philosophers is THE canonical concurrency problem. It illustrates deadlock, starvation, and resource contention with one elegant scenario. Mastering it demonstrates deep understanding of synchronization.

## Detailed Explanation

**The setup**:
- 5 philosophers, 5 forks, circular table
- Each philosopher alternates between thinking and eating
- To eat: pick up left fork, pick up right fork, eat, put down both
- Each fork is shared between two adjacent philosophers

**Naive solution (deadlocks)**:
\`\`\`
Philosopher i:
  while (true) {
    think();
    pick_up(left_fork);
    pick_up(right_fork);
    eat();
    put_down(left_fork);
    put_down(right_fork);
  }
\`\`\`

**Why it deadlocks**: All 5 philosophers pick up their LEFT fork simultaneously. Now everyone holds one fork and waits for their right fork (which is someone else's left). Circular wait → deadlock.

**Solutions**:

**1. Resource hierarchy (lock ordering)**:
- Number forks 0-4
- Always pick up the lower-numbered fork first
- Philosopher 4 (between forks 4 and 0) must pick up fork 0 first, then 4
- Breaks circular wait

**2. Arbitrator (waiter)**:
- A central "waiter" semaphore allows only N-1 philosophers (e.g., 4) to attempt eating at once
- Guarantees at least one can get both forks
- Simple, prevents deadlock

**3. Chandy-Misra solution**:
- Forks are dirty/clean
- Philosophers request forks; holder gives if dirty, keeps if clean
- Eliminates need for shared resources between philosophers
- More complex but very efficient

**4. Asymmetric (odd-even)**:
- Odd-numbered philosophers pick left first; even-numbered pick right first
- Breaks the symmetry that causes deadlock
- Simple modification

**5. Conditional locking with try-lock**:
- Try to pick up both forks; if can't get the second, release the first
- Risk of livelock (everyone keeps trying and failing)
- Mitigate with random backoff

**Goals to satisfy**:
- **Mutex**: Two philosophers can't hold the same fork
- **Deadlock-free**: System makes progress
- **Starvation-free**: Every philosopher eventually eats
- **Concurrency**: Multiple philosophers eat simultaneously when possible

## Real-World Example
**Operating system locks**: When multiple threads need multiple resources (locks), the same deadlock pattern can occur. Lock ordering is the production analog of the resource hierarchy solution.

**Database transactions** acquiring multiple row locks: Same problem, same solution — always lock rows in a consistent order (e.g., by primary key).

**Distributed systems**: Distributed locking with multiple resources faces the same deadlock risk. Solutions include timeouts, deadlock detection, or hierarchical locking.

## Interview Tips
- The naive solution and its deadlock are foundational — explain step by step
- Resource hierarchy is the most-used real-world solution
- Mention starvation as a separate concern from deadlock
- Connect to lock ordering in production databases

## Common Follow-up Questions
1. Why does the naive solution deadlock? (All philosophers pick up left fork simultaneously — circular wait)
2. Difference between deadlock and starvation here? (Deadlock: nobody eats. Starvation: someone never eats while others do)
3. How does this relate to real concurrent programming? (Multi-resource locks need consistent ordering)`,

    'Segmentation vs Paging': `## Definition
**Paging** divides memory into fixed-size blocks (pages) for management — purely a memory management technique. **Segmentation** divides memory into variable-size logical units (segments) based on program structure — code, data, stack, heap each in their own segment. Modern systems use both, often combined.

## Why It Matters
Understanding the difference is foundational OS knowledge. Modern x86-64 uses primarily paging with vestigial segmentation, but knowing both clarifies why memory works the way it does.

## Detailed Explanation

**Paging**:
- Memory divided into FIXED-size pages (typically 4 KB)
- Virtual address space mapped to physical via page table
- Process sees a flat, contiguous virtual space
- Hardware translates virtual → physical via MMU and TLB
- Allows non-contiguous physical memory to appear contiguous to programs

**Segmentation**:
- Memory divided into VARIABLE-size segments based on logical units
- Each segment has a base address and a length
- Segments correspond to program structures: code segment, data segment, stack segment, heap segment
- Address consists of segment number + offset within segment
- Each segment can have different protection (code: read-only execute; stack: read-write no-execute)

**Comparison**:

| Aspect | Paging | Segmentation |
|--------|--------|--------------|
| Block size | Fixed | Variable |
| Visibility | Transparent to programmer | Visible to programmer (in pure systems) |
| Internal fragmentation | Yes (last page partial) | No |
| External fragmentation | No | Yes (variable-size leaves gaps) |
| Address translation | Page number + offset | Segment number + offset |
| Sharing | Page-level | Segment-level (more natural) |
| Protection | Page-level | Segment-level (matches program structure) |

**Internal vs External Fragmentation**:
- **Internal** (paging): A 4097-byte allocation gets two 4-KB pages — one is mostly empty
- **External** (segmentation): After allocating/deallocating segments of various sizes, free memory becomes a patchwork of small gaps that can't fit a large request even though total free is sufficient

**Modern combined approach (segmented paging)**:
- Logical address: segment + offset
- Each segment has its own page table
- Linux on x86: uses minimal segmentation (flat segments covering entire address space) and full paging
- Effectively pure paging with segmentation as a vestigial feature

**Pure segmentation** (e.g., older systems, MULTICS): Suffered external fragmentation. Compaction was needed periodically — expensive.

**x86 segmentation legacy**: 8086/80286 used real segmentation with 16-bit registers (segment registers CS, DS, SS, ES). 80386 added paging. x86-64 uses flat segmentation (all segments cover the same 0 to max), making it effectively a pure paged system.

**Why paging won out**:
- No external fragmentation
- Simpler hardware implementation
- Easier swap-in/swap-out (uniform page size)
- Fixed-size makes algorithms simpler

**Why segmentation persisted**:
- Maps naturally to program structure
- Per-segment protection makes security clearer
- Some specialized systems still use segmentation

## Real-World Example
**Modern Linux on x86-64**: Uses 4-level paging. Segmentation is "flat" — all segments span 0 to 2^64. The kernel doesn't really use segmentation; it's just present because the hardware requires it.

**Older Intel chips (8086, 80286)**: Real segmentation. Famous "segment:offset" addressing (e.g., 0x1234:0x5678). 16-bit segment + 16-bit offset = 20-bit physical address (1 MB max).

## Interview Tips
- Memorize the comparison table
- Internal vs external fragmentation is a classic follow-up
- Modern systems = paging dominant, segmentation vestigial
- Know that x86-64 uses flat segmentation (combined with paging)

## Common Follow-up Questions
1. Why does paging have internal fragmentation? (Last page rarely fully used)
2. Why does segmentation have external fragmentation? (Variable-size allocations leave gaps)
3. Does Linux use segmentation? (Minimally — flat segments + paging)`,

    'Bootloader': `## Definition
A **bootloader** is a small program that runs when a computer is powered on. Its job is to initialize the hardware enough to load and start the operating system kernel. It's the bridge between the firmware (BIOS/UEFI) and the OS.

## Why It Matters
The bootloader is the first software running on the machine. Understanding the boot process helps with low-level debugging, dual-boot configurations, and embedded systems development.

## Detailed Explanation

**The boot sequence**:

**1. Power-on / reset**:
- CPU starts at a fixed address (e.g., 0xFFFFFFF0 on x86)
- This address contains firmware (BIOS or UEFI)

**2. Firmware (BIOS or UEFI)**:
- **POST (Power-On Self-Test)**: Tests hardware (RAM, keyboard, disk)
- Initializes basic devices
- Locates a bootable device (configured boot order)
- **BIOS**: Reads the first 512 bytes (MBR — Master Boot Record) of disk into memory at 0x7C00, jumps there
- **UEFI**: Reads from EFI System Partition; loads bootloader as a normal file (.efi)

**3. Bootloader stage 1 (BIOS only)**:
- 512 bytes — extremely limited
- Job: load Stage 2 from a known location on disk
- BIOS gives up at this point — bootloader takes control

**4. Bootloader stage 2**:
- Larger, more capable
- Reads filesystem (knows about FAT32, ext4, etc.)
- Presents boot menu (multi-OS systems)
- Loads the OS kernel into memory
- May load initial RAM disk (initrd/initramfs)
- Switches CPU mode (real mode → protected mode → long mode on x86-64)
- Jumps to the kernel entry point

**5. Kernel takes over**:
- Bootloader's job is done
- Kernel initializes drivers, mounts filesystems, starts init/systemd

**Common bootloaders**:
- **GRUB (GRand Unified Bootloader)**: Most common Linux bootloader, supports multi-boot
- **LILO**: Older Linux bootloader, replaced by GRUB
- **Windows Boot Manager** (bootmgr): Windows-specific
- **systemd-boot**: Simple UEFI bootloader for Linux
- **U-Boot**: Common in embedded systems

**MBR vs GPT**:
- **MBR (Master Boot Record)**: Old DOS/BIOS scheme. 512-byte first sector. 4 primary partitions max. 2 TB disk limit.
- **GPT (GUID Partition Table)**: Modern UEFI scheme. 128 partitions. >2 TB support. Backup table for redundancy.

**Multi-stage bootloaders**: Why two stages?
- Stage 1 fits in tiny space (MBR's 512 bytes)
- Just needs to load Stage 2 from a known location
- Stage 2 has room for sophisticated logic (filesystem reading, menu, kernel loading)

**Modern UEFI**:
- No MBR limitation — bootloaders are normal files in the EFI System Partition
- Often signed (Secure Boot) — only trusted bootloaders can run
- More structured than legacy BIOS

## Real-World Example
**Booting Ubuntu on a laptop**:
1. Power on → UEFI runs
2. UEFI loads \`/EFI/ubuntu/grubx64.efi\` from EFI partition
3. GRUB shows boot menu (Ubuntu, advanced options, recovery)
4. User selects Ubuntu
5. GRUB loads \`/boot/vmlinuz\` (kernel) and \`/boot/initrd.img\` (initial RAM disk)
6. GRUB transfers control to kernel
7. Kernel initializes; mounts root filesystem; runs systemd
8. systemd starts services, login screen appears

## Interview Tips
- Know the BIOS vs UEFI distinction
- MBR's 512-byte limit explains why two-stage bootloaders exist
- GRUB is the canonical Linux example
- Mention Secure Boot for modern UEFI security

## Common Follow-up Questions
1. What's the MBR? (First 512 bytes of a disk — contains stage 1 bootloader and partition table)
2. What's initrd? (Initial RAM disk — temporary root filesystem during boot, has drivers needed to mount the real root)
3. UEFI vs BIOS? (UEFI: modern, file-based, GPT support, Secure Boot. BIOS: legacy, MBR, limited.)`,

    'Interrupt Handling': `## Definition
An **interrupt** is a signal to the CPU indicating that an event has occurred and needs immediate attention. **Interrupt handling** is the mechanism by which the OS pauses normal execution, runs an interrupt service routine (ISR), and resumes the original work. Interrupts are essential for responsive I/O and multitasking.

## Why It Matters
Interrupts are how computers handle the asynchronous real world — keystrokes, network packets, disk completions. Understanding interrupts explains how operating systems achieve responsiveness without polling everything constantly.

## Detailed Explanation

**Why interrupts exist**:
- Without them, the CPU would have to constantly poll devices ("is there input yet?")
- Polling wastes CPU cycles
- Interrupts let devices SIGNAL the CPU when they need attention
- CPU can do other work in the meantime

**Types of interrupts**:

**1. Hardware interrupts** (asynchronous):
- Generated by external devices (keyboard, mouse, disk, network card, timer)
- Arrive unpredictably (truly async with current execution)
- Examples: keystroke arrives, network packet received, timer ticks, disk read completes

**2. Software interrupts** (synchronous):
- Generated by executing instructions
- Predictable from program flow
- Examples: system calls (\`int 0x80\`, \`syscall\` instruction), debugging breakpoints

**3. Exceptions / Traps**:
- Generated by errors or special conditions during execution
- Examples: division by zero, page fault, invalid instruction, segmentation fault

**Interrupt handling sequence**:
1. **Interrupt occurs** (hardware signal or software instruction)
2. **CPU finishes current instruction** (in most architectures)
3. **Save context**: CPU pushes program counter, flags, and possibly registers onto stack
4. **Interrupt vector table lookup**: CPU uses interrupt number as index into a table; finds the address of the ISR (Interrupt Service Routine)
5. **Switch to kernel mode** (if not already there)
6. **Execute ISR**: The handler does its work — reads keystroke, processes packet, etc.
7. **Restore context**: Pop saved state from stack
8. **Return** via special instruction (\`iret\` on x86)
9. **Resume** original program

**Critical concepts**:

**Interrupt Vector Table (IVT) / Interrupt Descriptor Table (IDT)**: Array of pointers to ISRs. Each interrupt number indexes a specific handler. CPU consults this on interrupt.

**Masking interrupts**: ISRs run with interrupts disabled by default to prevent re-entrance. Some interrupts can be temporarily masked. Critical sections in kernel often disable interrupts briefly.

**Priority levels**: Some interrupts are more urgent than others. Higher-priority interrupts can preempt lower-priority ISRs. Modern CPUs have interrupt priority levels.

**Top-half / Bottom-half (Linux)**: To minimize time with interrupts disabled, Linux splits handlers:
- **Top half (hard IRQ)**: Quick, urgent work (acknowledge device, copy data)
- **Bottom half (softirq, tasklet, workqueue)**: Deferred, longer work runs with interrupts enabled

**Polling vs Interrupts**:
- **Polling**: CPU constantly checks. Simple but wastes cycles. Predictable latency.
- **Interrupts**: Async notification. Efficient but adds overhead per interrupt. Best when events are infrequent.
- **Hybrid (NAPI in Linux)**: Switch to polling under high load (network drivers) — avoids interrupt storm.

## Real-World Example
**Keyboard input**: You press 'A':
1. Keyboard controller signals interrupt to CPU
2. CPU saves current state, looks up ISR address in IDT
3. ISR reads scan code from keyboard controller, queues it for the OS to process
4. ISR returns, CPU resumes whatever it was doing
5. Later, the OS reads the queue, sends 'A' to the focused window

**Without interrupts**, the CPU would have to constantly check the keyboard ("is a key pressed yet?"), wasting >99% of cycles for the rare event of a keystroke.

## Interview Tips
- Know hardware vs software interrupts vs exceptions
- IDT/IVT is the lookup mechanism
- Top-half/bottom-half is Linux-specific terminology that impresses
- Mention real-time systems where interrupt latency matters

## Common Follow-up Questions
1. Polling vs interrupts? (CPU efficiency vs simplicity; choice depends on event frequency)
2. What's interrupt latency? (Time from interrupt to ISR execution — critical for RT systems)
3. Why are interrupts often disabled in ISRs? (Prevent reentrance; keep ISR atomic)`,

    'DMA': `## Definition
**Direct Memory Access (DMA)** is a hardware feature that allows peripherals (disk controllers, network cards, GPUs) to transfer data directly to/from memory without involving the CPU for each byte. The CPU sets up the transfer, then the DMA controller handles the actual data movement, freeing the CPU for other work.

## Why It Matters
DMA is crucial for high-throughput I/O. Without it, the CPU would be 100% busy moving data byte by byte. With DMA, modern systems achieve gigabytes-per-second transfer rates while the CPU does other work.

## Detailed Explanation

**Without DMA (programmed I/O)**:
\`\`\`
For each byte:
  CPU reads from device register
  CPU writes to memory
\`\`\`
Problem: Reading 1 GB requires 1 billion CPU operations. CPU is fully consumed.

**With DMA**:
\`\`\`
1. CPU configures DMA controller:
   - Source address (device register)
   - Destination address (memory)
   - Byte count
   - Direction
2. CPU goes off and does other work
3. DMA controller transfers all bytes
4. DMA signals CPU via interrupt when done
5. CPU processes the data (already in memory)
\`\`\`
CPU touches only the start and end of the transfer — millions of times more efficient.

**How DMA works**:
- DMA controller is a separate piece of hardware (or integrated chipset feature)
- Has access to the system bus
- CPU and DMA controller share access via **bus arbitration**
- During DMA transfer, CPU may briefly pause if both want the bus (cycle stealing)
- Modern systems have dedicated DMA channels per device

**DMA modes**:

**1. Burst mode**: DMA controller takes the bus, transfers entire block, releases bus. Fastest but blocks CPU temporarily.

**2. Cycle stealing**: DMA takes the bus for one transfer at a time. CPU and DMA alternate — neither blocks long.

**3. Transparent mode**: DMA only uses the bus when CPU isn't using it. Slowest DMA but CPU never blocked.

**Common DMA-using devices**:
- **Disk drives**: SATA, NVMe drives use DMA for reads/writes
- **Network cards**: Receive packets directly into memory (NAPI optimizes this)
- **GPUs**: Transfer textures, vertex data, frame buffers
- **Sound cards**: Audio buffers
- **USB controllers**: Bulk transfers

**Modern variations**:

**DMA Coherency**: With CPU caches, data DMA'd into memory may be in CPU cache (stale). Either:
- Flush cache before DMA (software-managed)
- Hardware-coherent DMA (cache snoops DMA writes — modern x86)

**IOMMU (I/O Memory Management Unit)**: Like an MMU but for devices. Translates device-visible addresses to physical addresses. Enables:
- Virtualization (VMs can directly drive devices)
- Security (devices can't read arbitrary memory — DMA attacks defense)
- Scatter/gather across non-contiguous memory

**Zero-copy I/O**: Combined with DMA — file system reads disk DMA → network DMA without CPU touching data. Used by high-performance servers (sendfile system call, kernel-bypass networking).

## Real-World Example
**File copy**: When you \`cp file1 file2\`:
1. OS issues read to disk controller (CPU sets up DMA)
2. Disk reads data via DMA into kernel buffer
3. CPU is free during this transfer
4. Once read complete, OS issues write to disk
5. Disk writes data via DMA from kernel buffer
6. CPU does context switches and other work in between

Without DMA, the CPU would be reading one byte from disk at a time — file copies of 1 GB would take hours.

## Interview Tips
- Frame DMA as "I/O without CPU bottleneck"
- Know cache coherency is a key DMA concern
- Mention IOMMU for security/virtualization context
- Zero-copy is a great keyword for performance-critical scenarios

## Common Follow-up Questions
1. What's the role of CPU during DMA? (Set up transfer, do other work, handle completion interrupt)
2. What's cache coherency in DMA? (Ensuring CPU caches see fresh data after DMA writes to RAM)
3. What's IOMMU for? (Address translation for devices — security and virtualization)`,

    'Disk Scheduling': `## Definition
**Disk scheduling** is the algorithm an OS uses to decide the order in which disk I/O requests are serviced. The goal is to minimize seek time (head movement on traditional spinning disks) and maximize throughput, while maintaining fairness and avoiding starvation.

## Why It Matters
Disk I/O has historically been the slowest part of systems (milliseconds vs microseconds for RAM). Smart scheduling dramatically improves performance for workloads with many concurrent I/O requests. SSDs change the calculus but scheduling still matters.

## Detailed Explanation

**Why scheduling matters (HDDs)**:
- Disk has a moving arm (head) that must physically travel to read data
- Seek time (head movement) and rotational latency dominate access time
- Servicing requests in arrival order may cause excessive head movement
- Smart ordering reduces total seek time

**Common algorithms**:

**1. FCFS (First-Come, First-Served)**:
- Service in arrival order
- Fair, simple
- Can be inefficient — head may bounce all over the disk

**2. SSTF (Shortest Seek Time First)**:
- Service the request closest to the current head position
- Minimizes individual seek times
- **Problem**: Starvation — requests far from current position may wait forever if requests near the head keep arriving

**3. SCAN (Elevator algorithm)**:
- Head moves in one direction, servicing all requests on its way
- Reverses at the end of the disk
- Like an elevator: services all floors going up, then all going down
- Fair — every request eventually serviced

**4. C-SCAN (Circular SCAN)**:
- Like SCAN but only services in one direction
- Returns to the start without servicing on the way back
- More uniform wait times than SCAN
- Slightly less efficient (wasted return trip)

**5. LOOK / C-LOOK**:
- Like SCAN/C-SCAN but reverses at the LAST request, not the disk end
- More efficient — doesn't move past the last request unnecessarily

**Modern Linux schedulers**:
- **noop**: FCFS — good for SSDs (no seek time)
- **deadline**: Bounds latency for read/write requests
- **CFQ (Completely Fair Queuing)**: Fair time slices per process
- **BFQ (Budget Fair Queuing)**: Modern fairness-focused
- **mq-deadline / Kyber**: Modern multi-queue versions

**HDDs vs SSDs**:
- **HDDs**: Seek-dominant. Scheduling matters a lot. SCAN/LOOK family ideal.
- **SSDs**: No seek. Random access ~ sequential. Simpler algorithms (noop, mq-deadline) work fine. Focus shifts to write amplification, garbage collection.

## Real-World Example
**Database servers**: With many concurrent queries, smart disk scheduling significantly improves throughput. Linux's deadline scheduler is popular for databases — bounded latency matters.

**Video streaming servers**: Sequential reads benefit from scheduler. Multiple streams need fair sharing — CFQ-style for fairness.

**SSDs in modern systems**: The traditional algorithms matter less. Most modern Linux defaults to mq-deadline or noop for SSDs since seeks aren't physical.

## Interview Tips
- Memorize the main algorithms (FCFS, SSTF, SCAN, C-SCAN, LOOK)
- Know SSTF can starve — classic exam question
- SCAN's "elevator" analogy is memorable
- For SSDs, scheduling matters less but isn't irrelevant

## Common Follow-up Questions
1. Why is SSTF prone to starvation? (Far-away requests may wait forever as nearby ones keep coming)
2. SCAN vs C-SCAN difference? (C-SCAN only services in one direction — more uniform waits)
3. Why don't SSDs need complex scheduling? (No seek time — random access is uniform)`,

    'Copy-on-Write': `## Definition
**Copy-on-Write (COW)** is an optimization where multiple users share the same data initially, with copies only made when one user attempts to modify the data. It allows lazy duplication, saving memory and time for the common case where data is read-only or rarely modified.

## Why It Matters
COW is everywhere in modern systems — fork() in Unix, snapshot file systems (ZFS, Btrfs), container layers, modern programming language strings. Understanding COW explains how systems achieve massive scalability with limited memory.

## Detailed Explanation

**Without COW** (eager copying):
- Every duplication immediately allocates new memory and copies data
- Wasteful if the copy is rarely modified
- Example: \`fork()\` would have to duplicate the entire process memory upfront

**With COW**:
- Initial duplication is cheap — just share pointers/references
- Mark the shared data as read-only
- When ANYONE writes, OS detects the write attempt
- Triggers a page fault → kernel makes a private copy for that writer → write proceeds
- Other readers continue with the original

**The mechanism (in fork())**:
1. \`fork()\` creates child process
2. Both parent and child share all memory pages
3. All shared pages marked **read-only** in both page tables
4. Child immediately calls \`exec()\` (common case): no actual copying needed!
5. If parent or child writes to a page:
   - Hardware triggers page fault (write to read-only page)
   - Kernel allocates new physical frame
   - Copies the page contents
   - Maps the new frame into the writer's page table (now writable)
   - Marks the original as writable in the other process's table
6. Now they have private copies of just that page

**Benefits**:
- **Performance**: Fork is incredibly fast — no full memory duplication
- **Memory savings**: Read-only data shared across processes
- **Lazy allocation**: Pay only for what's actually modified

**COW use cases**:

**1. fork() in Unix/Linux**: As described — without COW, fork would be impractically slow.

**2. Snapshot filesystems** (ZFS, Btrfs, APFS):
- Snapshot is a "copy" at a point in time
- Initially, snapshot shares all blocks with the original
- When something changes, the new version uses new blocks; the snapshot still references old ones
- Cheap snapshots, even of huge filesystems

**3. Container layers (Docker)**:
- Container shares base image's read-only layers
- Modifications go to a writable top layer (overlay filesystem uses COW)

**4. Memory-mapped files**:
- \`mmap()\` with MAP_PRIVATE — modifications don't affect the file
- COW kicks in on first write to a mapped page

**5. Programming language strings (Java up to Java 7, Python intern, immutable structures)**:
- Strings are immutable — can be safely shared
- Persistent data structures (Clojure, Scala) use COW-like structural sharing

**Trade-offs**:

**Pros**:
- Amortized cost — only pay when actually modifying
- Excellent for read-heavy or rarely-modified data
- Enables efficient snapshots

**Cons**:
- First write to each shared region is slower (copy + page fault)
- Memory usage is unpredictable — depends on write patterns
- Complex bookkeeping (reference counts, copy-on-write tracking)

## Real-World Example
**\`fork()\` then \`exec()\`** (running a shell command):
1. Shell calls fork() — child process created with COW pages
2. NO actual memory copy happens (just page table marking)
3. Child immediately calls exec("ls") — replaces all memory with new program
4. Shared pages discarded entirely — no copy was wasted

Without COW, fork would copy entire shell memory just to throw it away in exec — incredibly wasteful.

**Btrfs snapshots**: \`btrfs subvolume snapshot /home /home_backup\` is instantaneous — no data copied. Both versions share blocks. Modify a file in /home → only the modified file's blocks are duplicated.

**Docker container layer modification**: Editing a file in a container copies just that file from the base image to the writable layer. The original image is unchanged.

## Interview Tips
- COW is the answer to "how can fork() be fast?" — classic question
- Connect to virtualization, containers, snapshots — modern context
- Know it's also a programming language pattern (immutable strings, persistent data structures)

## Common Follow-up Questions
1. What triggers the actual copy? (Write attempt to read-only-marked page → page fault → kernel handles)
2. Why mark pages read-only? (So write attempts trigger faults the kernel can intercept)
3. What's the alternative to COW? (Eager copying — duplicate everything immediately, much slower)`,

    'Preemptive vs Non-Preemptive': `## Definition
**Preemptive scheduling** allows the OS to forcibly take the CPU away from a running process to give it to another (typically when a higher-priority process arrives or a time quantum expires). **Non-preemptive scheduling** lets a running process keep the CPU until it voluntarily yields (blocks on I/O, completes, or explicitly gives up).

## Why It Matters
The choice profoundly affects system responsiveness, fairness, and predictability. All modern general-purpose OSes use preemptive scheduling — but understanding both helps you design real-time systems and reason about scheduling trade-offs.

## Detailed Explanation

**Preemptive scheduling**:
- OS interrupts running process at certain events
- Triggered by: timer interrupt (quantum expiration), higher-priority process arrival, blocking on resource
- Allows fair CPU sharing — no process can monopolize
- Required for interactive responsiveness

**Non-preemptive scheduling**:
- Running process holds CPU until done or blocks voluntarily
- Simpler — no forced context switches
- Fast process throughput (no context switch overhead per quantum)
- One slow process can block all others (poor responsiveness)

**Comparison**:

| Aspect | Preemptive | Non-Preemptive |
|--------|------------|-----------------|
| Control | OS takes CPU | Process yields voluntarily |
| Responsiveness | High | Poor (long jobs delay short ones) |
| Throughput | Slightly lower (context switch overhead) | Higher |
| Complexity | Higher (synchronization needed) | Lower |
| Race conditions | More likely (interrupts can happen anywhere) | Easier to avoid |
| Fairness | Easy to enforce | Hard — depends on processes yielding |
| Use cases | Interactive systems, modern OSes | Batch systems, embedded, cooperative |

**Algorithms by category**:

**Preemptive algorithms**:
- Round Robin
- Priority Scheduling (preemptive variant)
- Shortest Remaining Time First (SRTF)
- Multilevel Feedback Queue
- Linux CFS

**Non-preemptive algorithms**:
- FCFS (First-Come, First-Served)
- SJF (Shortest Job First) — non-preemptive variant
- Priority Scheduling (non-preemptive variant)

**Why preemption is essential for modern OSes**:

1. **Interactive responsiveness**: A web server processing 100 long requests should still respond to a new short request quickly. Preemption ensures fair time slicing.

2. **Fault containment**: A buggy process in an infinite loop won't hang the system — preemption forces it to share.

3. **Real-time guarantees**: A high-priority process can immediately preempt a lower-priority one — needed for real-time systems (audio, control loops).

**Why non-preemptive is sometimes preferred**:

1. **Embedded systems**: Predictable timing — when you say "this code runs to completion," it does.

2. **Cooperative multitasking** (early Mac OS, Windows 3.1): Simpler implementation; processes had to be well-behaved.

3. **Coroutines / cooperative threading** (Python asyncio, Go goroutines internally): User-mode cooperative scheduling avoids kernel preemption overhead.

4. **Reduced synchronization overhead**: No interrupt at unexpected places means less locking needed in some cases.

## Real-World Example
**Modern Linux/Windows/macOS**: All preemptive. Time quanta of ~10 ms (Linux) ensure no process monopolizes. You can run dozens of programs simultaneously, each feeling responsive.

**Old Windows 3.x and pre-OS X Mac**: Cooperative (non-preemptive). One bad app could freeze the whole system — common complaint of that era. Modern OSes solved this with preemption.

**Real-time OSes (RTOS)**: Strict priority preemption. The highest-priority ready task ALWAYS runs. Critical for medical devices, aviation, automotive.

**Python's GIL with cooperative scheduling (asyncio)**: Non-preemptive within the event loop — coroutines must \`await\` to yield. Simple, but a long synchronous block freezes the loop.

## Interview Tips
- Modern OSes are all preemptive — that's the default answer
- Cooperative multitasking is a fun history reference (old Mac, Win 3.1)
- Connect to real-time systems for credibility
- Know that asyncio/coroutines are cooperative within their domain

## Common Follow-up Questions
1. Why is preemption essential for fairness? (Without it, one process can monopolize CPU)
2. Why are non-preemptive systems simpler? (Fewer race conditions, no surprise context switches)
3. What's the cost of preemption? (Context switch overhead each quantum + possible cache pollution)`,

    'Unix Signals': `## Definition
**Unix signals** are software interrupts delivered to processes as a form of asynchronous notification. They allow the OS or other processes to notify a process of events (errors, user actions, control commands) and request specific handling. Signals are a fundamental IPC and process control mechanism.

## Why It Matters
Signals are how Unix-like systems handle process control, error notifications, and inter-process communication for simple cases. Understanding signals is essential for daemon programming, debugging, and graceful shutdown.

## Detailed Explanation

**Signal characteristics**:
- Asynchronous (can arrive at any time)
- Limited information (just the signal number, plus optional data in real-time signals)
- Have predefined meanings (mostly)
- Each signal has a default action; can be customized via handlers

**Common signals** (POSIX):

| Signal | Number | Default Action | Meaning |
|--------|--------|----------------|---------|
| SIGHUP | 1 | Terminate | Terminal disconnected (or reload config) |
| SIGINT | 2 | Terminate | Interrupt (Ctrl+C) |
| SIGQUIT | 3 | Core dump | Quit (Ctrl+\\) |
| SIGILL | 4 | Core dump | Illegal instruction |
| SIGABRT | 6 | Core dump | abort() called |
| SIGFPE | 8 | Core dump | Floating-point exception |
| **SIGKILL** | 9 | Terminate | Kill (CANNOT be caught/ignored) |
| SIGUSR1 | 10 | Terminate | User-defined |
| SIGSEGV | 11 | Core dump | Segmentation violation |
| SIGUSR2 | 12 | Terminate | User-defined |
| SIGPIPE | 13 | Terminate | Wrote to pipe with no readers |
| SIGALRM | 14 | Terminate | Timer signal (alarm()) |
| SIGTERM | 15 | Terminate | Termination request (default kill) |
| SIGCHLD | 17 | Ignore | Child status changed |
| **SIGSTOP** | 19 | Stop | Stop process (CANNOT be caught) |
| SIGCONT | 18 | Continue | Continue if stopped |
| SIGTSTP | 20 | Stop | Stop from terminal (Ctrl+Z) |

**Special signals**:
- **SIGKILL (9)** and **SIGSTOP (19)**: Cannot be caught, blocked, or ignored. Always work. Used to forcibly kill or pause.
- All others can be caught with custom handlers, ignored, or blocked temporarily.

**Sending signals**:
- \`kill -SIGNAL pid\` from shell (e.g., \`kill -9 1234\` sends SIGKILL)
- \`kill(pid, signal)\` syscall
- \`raise(signal)\` to send to self
- Keyboard: Ctrl+C → SIGINT, Ctrl+Z → SIGTSTP, Ctrl+\\ → SIGQUIT

**Handling signals in code**:
\`\`\`c
#include <signal.h>

void handler(int sig) {
  printf("Got signal %d\\n", sig);
}

int main() {
  signal(SIGINT, handler);    // catch Ctrl+C
  signal(SIGTERM, handler);   // catch kill default
  // ... main work ...
}
\`\`\`

**Signal handling rules**:
- Handlers should be **async-signal-safe** — only call functions safe to call from interrupt context (very limited list)
- Don't use \`printf\`, \`malloc\`, locks in handlers (can deadlock)
- Use \`write()\` (not stdio), and \`sigatomic\` types for sharing data
- Set a flag in handler; do real work in main loop

**SIGTERM vs SIGKILL — graceful shutdown**:
- SIGTERM: "please terminate" — process can clean up
- SIGKILL: "die NOW" — no chance to clean up; OS removes process
- Best practice: \`kill\` (sends SIGTERM by default) → wait → \`kill -9\` if still running

## Real-World Example
**Graceful shutdown of a web server**: 
1. \`systemctl stop nginx\` sends SIGTERM
2. Nginx catches SIGTERM, finishes ongoing requests, closes sockets, writes logs
3. Nginx exits cleanly

If SIGTERM is ignored, eventually \`systemctl\` sends SIGKILL — forces termination but leaves resources potentially in bad state.

**Reload configuration**: Many daemons treat SIGHUP as "reload config":
\`\`\`
kill -HUP $(pidof nginx)  # nginx re-reads config without restart
\`\`\`

**Containers**: Docker stops containers by sending SIGTERM to PID 1, then SIGKILL after timeout. Apps must handle SIGTERM for graceful shutdown — common bug source if not implemented.

## Interview Tips
- Memorize SIGKILL (9) and SIGTERM (15) — most asked
- SIGKILL/SIGSTOP can't be caught — important detail
- Know async-signal-safety as a gotcha
- Mention graceful shutdown via SIGTERM as a real-world pattern

## Common Follow-up Questions
1. Why can't SIGKILL be caught? (To guarantee a way to forcibly kill processes — security/reliability)
2. What's the difference between SIGTERM and SIGKILL? (Polite vs forced — first allows cleanup)
3. What's an async-signal-safe function? (Function safe to call from a signal handler — very limited list)`,

    'RTOS vs GPOS': `## Definition
A **Real-Time Operating System (RTOS)** is designed to guarantee that critical tasks meet their deadlines — predictable timing is more important than throughput. A **General-Purpose Operating System (GPOS)** like Linux or Windows optimizes for fairness, throughput, and feature richness, with no strict timing guarantees.

## Why It Matters
RTOSes power critical systems — medical devices, automotive, aviation, industrial control — where missing a deadline can cause catastrophic failure. Knowing the difference is essential for embedded and systems engineering.

## Detailed Explanation

**RTOS characteristics**:
- **Deterministic timing**: Bounded latency for critical operations
- **Priority-based preemption**: Highest-priority task always runs immediately
- **Predictability over throughput**: Don't optimize average case; optimize worst case
- **Limited features**: Smaller, simpler, less general
- **Strict timing guarantees**: Operations have known maximum durations

**GPOS characteristics**:
- **Fair sharing**: Many users/processes get equitable resources
- **High throughput**: Maximize work done over time
- **Feature-rich**: Extensive APIs, GUI, networking, file systems
- **Best-effort timing**: Average case good, worst case unbounded
- **Optimized for typical workloads**: Servers, desktops, mobile

**Hard vs soft real-time**:

**Hard real-time**: Missing a deadline = system failure or catastrophic outcome.
- Examples: airbag deployment, pacemaker, flight control
- Latency must be bounded under ALL conditions

**Soft real-time**: Missing a deadline degrades quality but isn't catastrophic.
- Examples: video playback (dropped frames), streaming audio
- Statistical guarantees, not absolute

**Comparison**:

| Aspect | RTOS | GPOS (Linux/Windows) |
|--------|------|----------------------|
| Goal | Predictable timing | Throughput, features |
| Scheduler | Strict priority preemptive | Fair-share (CFS), priority |
| Interrupt latency | Bounded (microseconds) | Unbounded (can be milliseconds) |
| Memory | Static allocation preferred | Dynamic allocation common |
| Features | Minimal (kernel, scheduler, basic IPC) | Extensive (GUI, networking, etc.) |
| Footprint | Tiny (KB range) | Large (GB) |
| Typical use | Embedded, control systems | PCs, servers, phones |
| Examples | VxWorks, QNX, FreeRTOS | Linux, Windows, macOS |

**Linux as a soft real-time system**:
- **PREEMPT_RT patch**: Makes Linux mostly preemptible
- **Real-time scheduler classes** (SCHED_FIFO, SCHED_RR): Strict priorities
- Used in systems with soft RT needs (audio production, robotics)
- Not "hard" RT, but close

**Examples of RTOSes**:
- **VxWorks**: Aerospace (Mars rovers!), defense
- **QNX**: Automotive (BMW, Ford infotainment), medical
- **FreeRTOS**: Tiny, free, used in IoT (Amazon FreeRTOS)
- **Zephyr**: Open-source, IoT
- **uC/OS**: Industrial control

## Real-World Example
**Antilock Braking System (ABS)**: Must compute brake adjustments at 100 Hz with bounded latency. RTOS guarantees the computation finishes within 10 ms always — even if other things are happening. A GPOS might delay due to garbage collection, page swap, etc.

**Mars Rover (VxWorks)**: When the rover detects a rock, it must compute avoidance trajectory in bounded time. Hard real-time required.

**Airbag deployment**: Must deploy within ~30 ms of crash detection. Microsecond-scale guarantees needed. RTOS or dedicated microcontroller.

## Interview Tips
- Hard vs soft real-time distinction is crucial
- "RTOS prioritizes predictability over throughput" — memorable summary
- Mention priority inversion and inheritance
- VxWorks (Mars rover), QNX (cars) are great examples

## Common Follow-up Questions
1. Hard vs soft real-time? (Catastrophic deadline miss vs degraded quality)
2. Why is Linux not hard real-time? (Kernel can be non-preemptible briefly; GC, page faults add jitter)
3. What's priority inversion? (Low-priority holds resource needed by high-priority, while medium-priority preempts low → high effectively delayed)`,

    'Swapping': `## Definition
**Swapping** is the OS technique of moving entire processes (or pages, in modern systems) between RAM and disk to free up physical memory. Originally meant moving whole processes; in modern paged systems, "swap" refers specifically to moving individual pages to disk and back.

## Why It Matters
Swap allows running more programs than physical RAM allows. Understanding swap explains memory pressure, system slowdowns, and capacity planning — essential for DevOps and performance work.

## Detailed Explanation

**Original swapping** (whole-process):
- Entire process moved between RAM and disk
- Disk area called "swap space" or "swap partition"
- Now obsolete — replaced by paging

**Modern swapping (= paging to disk)**:
- Individual pages moved (not whole processes)
- Inactive pages written to swap; reread when needed
- Allows oversubscription of RAM

**Swap space organization**:
- **Swap partition**: Dedicated disk partition (Linux: \`mkswap\` + \`swapon\`). Faster, simpler.
- **Swap file**: Regular file used as swap (\`fallocate\` + \`mkswap\` + \`swapon\`). More flexible, slightly slower.

**Why swap pages**:
- RAM is limited; sometimes total active memory exceeds physical RAM
- Some pages are rarely used (background daemons' code, idle apps)
- Better to swap idle pages than fail allocations

**Page swap-out process**:
1. Memory pressure detected (free RAM low)
2. OS picks a victim page (LRU, Clock, etc.)
3. If page is "dirty" (modified), write it to swap
4. If "clean" (unchanged from disk), just discard (re-read from original source if needed)
5. Free the frame for new use

**Page swap-in process**:
1. Process accesses a swapped-out page
2. Page fault (page not present in RAM)
3. OS finds the page in swap
4. Allocates a frame (possibly evicting another page first)
5. Reads the swap page into the frame
6. Updates page table
7. Resumes the process

**Costs of swapping**:
- **Latency**: Disk access is ~100,000× slower than RAM
- **CPU overhead**: Page faults trigger kernel code
- **Thrashing**: Excessive swapping destroys performance
- **Disk wear**: Especially on SSDs (write cycles)

**Tunable parameters (Linux)**:

**Swappiness (0–100)**:
- Controls how aggressively kernel uses swap
- High (60–100): Swaps anonymous pages eagerly to free RAM for cache
- Low (0–10): Avoids swap, prefers shrinking page cache
- Default: 60 on most distros, 10 on databases servers (avoid swap)

**Should you have swap?**:
- **Yes for desktops**: Allows hibernation, handles unexpected memory pressure
- **Maybe for servers**: Add some, with low swappiness — emergency cushion
- **No for high-performance/realtime**: Predictable memory access matters more than oversubscription
- **Trend**: With cheap RAM, less swap needed — but always have some

**Modern alternatives**:
- **zswap**: Compressed cache for swap pages in RAM — faster than disk swap
- **zram**: Compressed RAM-based swap device (no disk involvement)
- **OOM killer**: Last-resort process killing when out of memory

## Real-World Example
**Laptop with 8 GB RAM running heavy workload**: Browser with 50 tabs, IDE, video calls. Total active = 10 GB. Without swap → OOM kill, lost work. With swap → least-used pages swapped, system stays responsive (but slower).

**Database server with 64 GB RAM**: Setting \`vm.swappiness=1\` minimizes swap usage. Database wants its working set entirely in RAM; even small swap usage causes huge latency spikes.

**Hibernation**: Laptop hibernates by writing entire RAM to swap, then powers off. On resume, swap contents are read back. This is why hibernation needs swap at least the size of RAM.

## Interview Tips
- Distinguish historical "swapping" (whole process) from modern "swap" (pages)
- Know swappiness parameter — common tuning question
- "Thrashing" connects to swap — high swap activity = thrashing
- Modern alternatives (zram, zswap) for advanced points

## Common Follow-up Questions
1. Difference between swapping and paging? (Originally whole process vs page; now often used interchangeably)
2. What is swappiness? (Linux parameter controlling swap aggressiveness, 0-100)
3. Should servers have swap? (Yes, but minimal with low swappiness — emergency only)`,

    'Daemon Process': `## Definition
A **daemon** is a background process that runs independently of any user session, typically providing services or performing maintenance tasks. Daemons usually start at boot, have no controlling terminal, and continue running until explicitly stopped or the system shuts down.

## Why It Matters
Daemons run all the services we depend on — web servers, databases, schedulers, network listeners. Knowing how to write and manage daemons is fundamental for system administration and server-side programming.

## Detailed Explanation

**Daemon characteristics**:
- Runs in background (no terminal, no user interaction)
- Independent of user logins (continues after user logs out)
- Often started at boot
- PID 1 (init/systemd) is typically the parent
- Often named ending in 'd' by convention: \`httpd\`, \`sshd\`, \`crond\`, \`syslogd\`

**Traditional daemonization steps** (creating a daemon):

1. **fork()**: Create a child process. Parent exits. Child becomes orphan, adopted by init.
2. **setsid()**: Create a new session. Child becomes session leader, detaching from any terminal.
3. **fork() again** (double fork): Ensures the daemon can never acquire a controlling terminal.
4. **chdir("/")**: Change working directory to root. Prevents holding a mounted filesystem.
5. **umask(0)**: Reset file creation mask so daemon can create files with explicit permissions.
6. **Close stdin/stdout/stderr**: Daemon shouldn't read/write terminal.
7. **Redirect to /dev/null**: Or to log files.
8. **Open log file**: For runtime logging (since stdout closed).
9. **Drop privileges**: Switch from root to a less-privileged user.
10. **Write PID file**: For management scripts to find and stop the daemon.

**Modern simplification (systemd)**:
- Don't need the whole double-fork dance
- systemd manages the process directly
- Daemon stays in foreground; systemd handles backgrounding, logging, restart policy
- Easier to write, debug, monitor
- Type=simple in systemd unit file

**Key daemon services in Linux**:

| Daemon | Service |
|--------|---------|
| \`init\`/\`systemd\` | PID 1 — boots system, manages services |
| \`sshd\` | SSH server |
| \`httpd\`/\`nginx\` | Web servers |
| \`crond\` | Scheduled tasks |
| \`syslogd\`/\`rsyslogd\`/\`journald\` | System logging |
| \`cupsd\` | Printing |
| \`dhcpd\` | DHCP server |
| \`bind\`/\`named\` | DNS server |
| \`mysqld\`/\`postgresql\` | Database servers |

**Differences from regular processes**:
- No controlling terminal
- No user session
- Often run as system users (nginx, mysql, postgres)
- Logs go to syslog/journald or files, not stdout
- Configuration via files (often in \`/etc/\`)
- Lifecycle managed by init system

## Real-World Example
**SSH daemon (sshd)**:
- Started at boot by systemd
- Listens on port 22
- For each incoming connection, forks a child to handle it
- Logs to journald
- No terminal, no user session
- Restarted automatically by systemd if crashed

**Cron daemon (crond)**:
- Reads crontab files
- Wakes up every minute to check for due jobs
- Forks subprocesses to run scheduled commands
- Classic daemon pattern

**Custom systemd unit file**:
\`\`\`
[Unit]
Description=My App
After=network.target

[Service]
Type=simple
ExecStart=/usr/bin/myapp
Restart=on-failure
User=myapp

[Install]
WantedBy=multi-user.target
\`\`\`
Save as \`/etc/systemd/system/myapp.service\`. Run \`systemctl enable myapp\` to start at boot.

## Interview Tips
- Know the traditional daemonization sequence (fork, setsid, fork, chdir, etc.)
- Modern systemd simplifies this — mention as evolution
- "ends in 'd'" naming convention is a good detail
- Daemon vs service distinction shows depth

## Common Follow-up Questions
1. Why double-fork? (Ensures daemon can never acquire a controlling terminal)
2. Why setsid? (Creates new session, detaches from terminal)
3. What's a Java daemon thread? (Thread that doesn't prevent JVM exit — for background tasks)`,

    'fork()': `## Definition
**fork()** is a Unix system call that creates a new process by duplicating the calling process. The new process (child) is an almost-exact copy of the original (parent). After fork, both processes execute the next instruction independently. fork() returns differently in each — 0 in child, child's PID in parent, -1 on failure.

## Why It Matters
fork() is the foundational way to create processes in Unix-like systems. Every other process-creation mechanism (exec, popen, system) uses fork internally. Understanding it is essential for systems programming.

## Detailed Explanation

**What fork() duplicates**:
- Memory contents (code, data, heap, stack) — but with copy-on-write
- Open file descriptors (parent and child share them initially)
- Environment variables
- Working directory
- Signal handlers
- Resource limits

**What's different**:
- **Process ID (PID)**: Each gets a unique PID
- **Parent PID (PPID)**: Child's PPID is the parent's PID
- **Return value of fork()**: 0 in child, child's PID in parent
- **Pending signals**: Child starts with empty queue
- **Resource utilization counters**: Reset for child
- **Thread state**: Only the calling thread is duplicated (not all threads — important detail!)

**Classic fork pattern**:
\`\`\`c
#include <unistd.h>
#include <sys/wait.h>

pid_t pid = fork();

if (pid < 0) {
    perror("fork");
    exit(1);
} else if (pid == 0) {
    // CHILD process
    printf("I am child, PID=%d\\n", getpid());
    exit(0);
} else {
    // PARENT process
    printf("I am parent, child's PID=%d\\n", pid);
    wait(NULL);  // wait for child to finish
}
\`\`\`

After fork(), both processes execute past it. The if/else uses the return value to differentiate.

**Copy-on-Write (COW) optimization**:
- fork() doesn't immediately copy all memory
- Pages marked read-only and shared
- Only when one process writes, that page is copied
- Makes fork() incredibly fast (just page table duplication)
- Crucial for the common fork-then-exec pattern

**fork() + exec() = run a different program**:
\`\`\`c
pid_t pid = fork();
if (pid == 0) {
    // child replaces itself with new program
    execvp("ls", (char*[]){"ls", "-l", NULL});
    perror("exec failed");
    exit(1);
}
// parent waits or does other things
\`\`\`
Without fork, exec would replace the current program — losing the parent. Fork+exec lets the parent stay alive and the child become a different program.

**fork() and threads**:
- fork() in a multi-threaded process is tricky
- Only the calling thread is in the child; others vanish
- Locks held by other threads remain "locked" in child but no one will release them — deadlock risk
- Best practice: fork before creating threads, or use posix_spawn instead

**Common pitfalls**:
- **Forgetting to handle fork return value**: pid < 0 means failure
- **Not waiting for children**: Creates zombies
- **Sharing file descriptors unintentionally**: Both can read/write same file — interleaved data
- **Forking without exec in multi-threaded program**: Thread state issues

**fork bombs**:
\`\`\`bash
:(){ :|:& };:    # classic shell fork bomb
\`\`\`
Recursive forking exhausts process slots. Why \`ulimit\` exists.

## Real-World Example
**Shell command execution** (\`bash\` running \`ls\`):
1. Bash calls fork()
2. Child (ls process) calls execvp("ls", ...)
3. Parent (bash) calls wait() to wait for ls
4. ls runs, exits
5. Bash's wait() returns; prints next prompt

**Web server architectures**:
- **Apache prefork**: One process per request — fork() for each connection
- **Pre-forked pool**: Master process forks workers at startup; workers handle multiple requests
- Classic process-based concurrency model

**Process-based isolation in Chrome**: Each tab is a fork+exec'd process — isolation, security, fault tolerance.

## Interview Tips
- Know fork returns 0/PID/-1 — common code question
- Copy-on-Write is the optimization — mention it
- Fork+exec pattern is foundational
- Threading + fork is a known gotcha

## Common Follow-up Questions
1. What does fork return? (0 in child, child's PID in parent, -1 on failure)
2. What is COW in fork? (Memory pages shared until written, then copied — fast fork)
3. Why is fork+exec common? (Most child processes are immediately replaced with a new program — fork creates the slot, exec replaces it)`,

    'exec()': `## Definition
**exec()** is a family of Unix system calls that REPLACES the current process's memory image with a new program. After exec, the original program is gone — the new program runs in its place, with the same PID. Unlike fork(), exec() doesn't create a new process; it transforms the current one.

## Why It Matters
Together with fork(), exec() is how Unix runs programs. Every command from the shell, every spawned process, every container image — all use exec(). Understanding it is fundamental.

## Detailed Explanation

**The exec() family** (variants in libc, all use \`execve\` syscall):

| Function | Difference |
|----------|------------|
| \`execl\` | Args as separate arguments (list), full path |
| \`execv\` | Args as array (vector), full path |
| \`execlp\` | List + searches PATH for executable |
| \`execvp\` | Vector + searches PATH |
| \`execle\` | List + custom environment |
| \`execve\` | Vector + custom environment (the actual syscall) |

Mnemonic: \`l\` = list, \`v\` = vector, \`p\` = PATH search, \`e\` = environment.

**Example**:
\`\`\`c
execl("/bin/ls", "ls", "-l", "-h", NULL);  // list + full path
execlp("ls", "ls", "-l", "-h", NULL);      // list + PATH search
execv("/bin/ls", argv);                     // vector + full path
execvp("ls", argv);                         // vector + PATH search
\`\`\`

**What exec() does**:
1. Loads the new program from disk
2. Replaces current process's text (code) with new program's code
3. Replaces data segment, heap, stack
4. Resets entry point to new program's main
5. Re-initializes signal handlers (some defaults restored)
6. **PRESERVES** open file descriptors (unless marked close-on-exec)
7. **PRESERVES** PID, PPID, session, working directory, umask, resource limits
8. Returns to new program's main, never returns to caller (unless error)

**What stays the same**:
- PID (same process — important!)
- Parent process
- File descriptors (typically — unless close-on-exec set)
- Process group, session
- User/group IDs
- Working directory

**What changes**:
- Code, data, heap, stack — all replaced
- Memory mappings — replaced
- Signal handlers — reset to defaults (custom handlers gone)
- Most process attributes derived from the new executable

**File descriptors and close-on-exec**:
- By default, open files survive exec
- This is how stdin/stdout/stderr stay connected (shell sets them up before exec)
- For sensitive descriptors (sockets, etc.), set FD_CLOEXEC flag → automatically closed on exec
- Modern best practice — prevent leaking fds to subprocesses

**The fork+exec pattern**:
\`\`\`c
pid_t pid = fork();
if (pid == 0) {
    // child: replace self with new program
    execvp("python", (char*[]){"python", "script.py", NULL});
    perror("exec failed");
    exit(1);
}
// parent: continue, or wait()
\`\`\`

If exec fails (file not found, permission denied), it returns. Otherwise, exec NEVER returns — the original code is gone.

**Why exec returns only on failure**:
- Success means the original program is replaced — there's no code to return to
- So any code after exec means it failed

**execve and shebangs**:
- Files starting with \`#!\` are scripts
- Kernel reads the shebang, invokes the interpreter (e.g., \`/usr/bin/python\`)
- Effectively \`execve("/usr/bin/python", "/usr/bin/python", "script.py", ...)\`

**setuid programs**:
- Programs with setuid bit run as file owner, not invoker
- exec() preserves setuid → child runs as owner
- Security mechanism for privileged operations (\`sudo\`, \`passwd\`)

## Real-World Example
**Shell command execution** (running \`grep\` from bash):
1. Bash parses input, identifies command \`grep error log.txt\`
2. Bash calls fork()
3. Child: closes/dups stdin/stdout/stderr if redirected, then \`execvp("grep", ["grep", "error", "log.txt", NULL])\`
4. The child's memory is replaced — bash code gone, grep code loaded
5. Same PID, but it's now grep, not bash
6. Parent (bash) waits via \`waitpid()\` until grep exits
7. Bash prints next prompt

**Container startup**: Docker container's PID 1 is whatever was specified in CMD/ENTRYPOINT. Docker fork+execs that program. The container "process" IS that program.

**Game launchers**: Steam launches a game by fork+exec. Steam stays running; the game is a separate process. Closing the game doesn't close Steam.

## Interview Tips
- "exec replaces the current process — doesn't create a new one"
- Know fork+exec idiom — the most common Unix pattern
- Mention exec returns only on failure
- Close-on-exec FD flag is a security/correctness gotcha

## Common Follow-up Questions
1. Difference between fork and exec? (Fork creates a new process; exec replaces the current process's program)
2. Why does exec only return on failure? (Success means the calling code is gone — replaced)
3. What's preserved across exec? (PID, fds (unless close-on-exec), working directory, etc.)`,

    'Spinlock': `## Definition
A **spinlock** is a low-level synchronization primitive where a thread waiting for a lock continuously checks (spins) until the lock becomes available, instead of yielding to the OS scheduler. Useful for very short critical sections where the cost of context switching exceeds the cost of busy-waiting.

## Why It Matters
Spinlocks are a fundamental tool in kernel programming and high-performance code where every nanosecond matters. Misusing them causes severe performance issues. Understanding them shows depth in concurrency.

## Detailed Explanation

**How spinlocks work**:
\`\`\`
while (atomic_test_and_set(&lock) == 1) {
    // spin — keep checking until lock becomes 0
}
// got the lock, now in critical section
// ... work ...
lock = 0;  // release
\`\`\`

The thread spins in a tight loop on \`test_and_set\` (or compare-and-swap) atomic operation. When the lock is released, one of the spinning threads succeeds and proceeds.

**Spinlock vs Mutex**:

| Aspect | Spinlock | Mutex |
|--------|----------|-------|
| Wait behavior | Busy-wait (CPU spinning) | Sleep (yields to OS) |
| Critical section length | Should be very short | Can be longer |
| Context switches | None (when held briefly) | Yes (sleep + wake) |
| CPU usage while waiting | 100% (spinning) | ~0% (sleeping) |
| Best for | Multi-core, short locks | Single-core or longer critical sections |
| Where used | Kernel, low-level code | Application code |

**When spinlocks are appropriate**:

**1. Very short critical sections**: A few instructions to a few hundred. Spinning briefly is cheaper than the ~microsecond cost of context switching.

**2. Multi-core systems**: Other cores can hold the lock and release it while we spin. On single-core, spinning is wasted — the lock holder can't run anyway.

**3. Cannot sleep**: Some kernel contexts (interrupt handlers) cannot sleep. Spinlocks are the only option.

**4. Lock contention is low**: If contention is high, threads spin a lot — wasteful.

**When spinlocks are bad**:

**1. Long critical sections**: Wastes massive CPU cycles spinning.

**2. Single-core**: Spinning prevents the lock holder from running. Deadlock risk.

**3. High contention**: Many threads spinning, all wasting CPU.

**4. Userspace usually**: Mutex is almost always better — modern futex-based mutexes are nearly as fast for short critical sections, and far better for longer ones.

**Variants and improvements**:

**1. Test-and-Test-and-Set (TTAS)**:
- First check without atomic op (cheap), then atomic if it looks free
- Reduces cache contention compared to plain test-and-set

**2. Backoff spinlocks**:
- Wait increasingly longer between retries
- Reduces cache thrashing under contention
- Exponential backoff is common

**3. Ticket locks**:
- Each thread takes a ticket number, waits until "now serving" matches
- FIFO ordering, fair
- Used in Linux kernel

**4. MCS lock**:
- Each thread spins on its OWN local variable, not the global lock
- Avoids cache line bouncing — much better under contention

**5. Adaptive mutex (modern OSes)**:
- Hybrid: spins briefly, then yields to scheduler
- Best of both worlds — fast for short locks, efficient for longer ones
- Linux's adaptive mutex, Java's biased locking

## Real-World Example
**Linux kernel**: Uses spinlocks extensively in interrupt handlers and short critical sections. \`spin_lock()\`, \`spin_lock_irqsave()\`. Cannot use mutex in interrupt context — must spin.

**Real-time systems**: Spinlocks predictable; mutex sleep/wake adds variability. RTOS often prefer spinlocks for critical sections.

**HFT (High-Frequency Trading)**: Sub-microsecond latency required. Spinlocks (with backoff) for shared state — context switch cost is unacceptable.

## Interview Tips
- Spinlock = busy-wait; Mutex = sleep
- Multi-core requirement is key — single-core spinlocks are bad
- Mention adaptive locks as the modern hybrid
- Used in kernel code where sleep is forbidden

## Common Follow-up Questions
1. When are spinlocks bad? (Long critical sections, single-core, high contention)
2. Why are they good in kernel code? (Interrupt handlers can't sleep)
3. What's an adaptive mutex? (Hybrid — spins briefly, then sleeps if still held)`,

    'User vs Kernel Threads': `## Definition
**Kernel threads** are managed entirely by the OS — the kernel knows about them, schedules them, and switches between them. **User threads** (or user-level threads) are managed in user space by a library, invisible to the kernel — the kernel sees only one thread per process. Modern systems often use a hybrid model.

## Why It Matters
The choice between user and kernel threads affects performance, scalability, and what kinds of operations a program can do efficiently. Understanding the difference explains why certain languages and runtimes (Go, Erlang) can handle millions of concurrent units while others (Java, C) typically handle thousands.

## Detailed Explanation

**Kernel threads (1:1 model)**:
- One user thread = one kernel thread
- OS scheduler manages each thread directly
- Each has its own kernel stack, registers, etc.
- Examples: POSIX threads (pthreads) on Linux, Windows threads, Java threads

**Pros of kernel threads**:
- True parallelism on multi-core (kernel can schedule each on different CPU)
- One thread blocking on I/O doesn't block others (kernel handles)
- OS handles preemption fairly

**Cons of kernel threads**:
- Heavyweight: each requires kernel resources
- Creation/destruction is expensive (syscall, kernel memory allocation)
- Context switching requires user/kernel mode transition
- Limited in number (often a few thousand max)

**User threads (N:1 model)** — also called "green threads":
- N user threads multiplexed onto 1 kernel thread
- User-space scheduler decides which one runs
- Kernel sees only one thread in the process
- Examples: Original Java green threads, GHC Haskell, early goroutines (in essence)

**Pros of user threads**:
- Very lightweight: no kernel involvement
- Fast context switch: just user-space register save/restore (~100x faster)
- Can have millions of them
- Custom scheduling possible

**Cons of pure user threads**:
- No true parallelism — only one runs at a time (single kernel thread)
- One thread blocking on I/O blocks ALL threads (kernel doesn't know to switch)
- Page fault in one thread blocks all
- Limited use today

**Hybrid (M:N model)**:
- M user threads multiplexed onto N kernel threads
- Best of both worlds — many user threads, but multiple kernel threads for parallelism
- Examples: Go goroutines, Erlang processes (BEAM VM), Project Loom (Java virtual threads)

**Comparison**:

| Aspect | Kernel (1:1) | User (N:1) | Hybrid (M:N) |
|--------|--------------|------------|--------------|
| Creation cost | High | Very low | Low |
| Context switch | Slow (mode switch) | Fast | Fast |
| Parallelism | Yes | No | Yes |
| Blocking I/O | Independent | Blocks all | Independent |
| Max threads | Thousands | Millions | Millions |
| Complexity | Low | Medium | High |

**Modern examples**:

**Go goroutines**: M:N model. \`go func()\` creates a goroutine — costs ~2 KB initially. Go runtime schedules thousands of goroutines onto a small pool of OS threads (GOMAXPROCS).

**Java Virtual Threads (Project Loom, JDK 21+)**: M:N model. \`Thread.startVirtualThread()\` creates a virtual thread on a pooled OS thread. Can have millions; cheap to create.

**Erlang processes**: User-space, M:N. Each process is tiny (300 bytes). Erlang systems run millions of concurrent processes.

**Linux pthreads**: 1:1 model. Each pthread = one kernel thread. Standard C/C++ threading.

## Real-World Example
**Web server handling 100,000 connections**:
- 1:1 model: Need 100,000 OS threads. Memory: 100 GB+ (1 MB stack each). Probably impossible.
- Async/event loop: 1 OS thread, callback hell. Hard to write.
- Hybrid (Go, Erlang): 100,000 goroutines on, say, 8 OS threads. Memory: ~200 MB (2 KB each). Sequential code style. Best of both.

**Why Go scales better than thread-per-connection Java**: Goroutines vs OS threads. Java's virtual threads (Loom) close the gap.

**Erlang's WhatsApp**: Famously handled 2 million connections per server with a small team — Erlang's lightweight processes made it possible.

## Interview Tips
- Know the three models: 1:1, N:1, M:N
- "Kernel threads = parallelism but heavy; user threads = lightweight but can't scale across cores"
- Goroutines are M:N — current example to mention
- Java's virtual threads (Loom) is modern relevant news

## Common Follow-up Questions
1. Why are goroutines lightweight? (M:N model — many goroutines on few OS threads, small initial stack)
2. Why was the user-thread model abandoned? (Couldn't use multi-core, blocking I/O blocked all)
3. What's the difference between thread and process? (Thread shares memory with siblings; process has its own)`,

    'Memory Leak': `## Definition
A **memory leak** occurs when a program allocates memory but fails to release it when no longer needed, even though the memory is unreachable. Over time, leaked memory accumulates, potentially exhausting system memory and crashing the program or system.

## Why It Matters
Memory leaks are one of the most common production bugs in long-running programs. Understanding causes, detection, and prevention is essential for any serious programmer — especially in non-garbage-collected languages.

## Detailed Explanation

**What it looks like**:
\`\`\`c
void leak() {
    int* arr = malloc(1000 * sizeof(int));
    // ... use arr ...
    return;  // forgot to free(arr) — leaked!
}
// Each call to leak() allocates 4KB; nothing freed
\`\`\`

If \`leak()\` is called repeatedly, memory usage grows unboundedly.

**In garbage-collected languages**:
GC handles freeing — but you can still leak by holding unintended references:
\`\`\`java
List<Object> cache = new ArrayList<>();
void process(Object obj) {
    cache.add(obj);  // never removed — list grows forever
    // ... process ...
}
\`\`\`
Even though GC could collect old objects, they're referenced by \`cache\` — kept alive forever.

**Common causes**:

**1. Forgotten frees (C/C++)**:
- malloc without matching free
- Multiple return paths, not all free
- Exceptions skipping cleanup

**2. Unbounded caches/collections**:
- Adding to a list/map without ever removing
- Cache without size limit or eviction
- Most common in long-running services

**3. Listener/observer leaks**:
- Object registers as listener, never deregisters
- Listener holds reference to subject — keeps it alive
- Common in GUI programming

**4. Closure captures**:
- Function captures variable, holding it alive longer than expected
- JavaScript event handlers especially prone

**5. Static fields**:
- Static fields live forever (until class unload)
- Holding references in statics keeps objects alive

**6. ThreadLocal not cleaned up**:
- ThreadLocal entries persist as long as the thread exists
- In thread pools, threads don't die — entries leak

**7. Resource handles**:
- File handles, sockets, database connections not closed
- Memory leak + handle leak

**8. Circular references in non-tracing GCs**:
- Reference-counted GC (Python, older Objective-C) can't collect cycles automatically
- A → B → A: both have count 1, never freed
- Modern GCs (Java, .NET) handle cycles correctly

**Detection tools**:

**C/C++**:
- **Valgrind** (Memcheck): The classic. Tracks every allocation, reports leaks at exit.
- **AddressSanitizer (ASan)**: Compile-time instrumentation, fast leak detection.
- **LeakSanitizer**: Standalone leak detector.

**Java**:
- **Heap dumps + Eclipse MAT**: Analyze what's holding memory
- **JProfiler**, **YourKit**: Commercial profilers
- **VisualVM**: Free profiler

**Python**:
- **tracemalloc**: Built-in tracking
- **objgraph**: Visualize reference graphs
- **memory_profiler**: Track over time

**JavaScript**:
- Chrome DevTools heap snapshots
- Three snapshots compared: identifies retained objects

**Symptoms in production**:
- Gradually increasing memory usage over hours/days
- OOM (Out-Of-Memory) crashes after long uptime
- Increasing GC pressure (in managed languages) — more time in GC, less in app
- "Restart fixes it" pattern

**Prevention strategies**:

**1. RAII (C++)**: Resource Acquisition Is Initialization. Wrap resources in objects whose destructors free them. Smart pointers (\`unique_ptr\`, \`shared_ptr\`).

**2. try-with-resources (Java) / using (C#)**: Automatic resource cleanup.

**3. Code reviews focused on lifecycle**: Every alloc must have matching free; every listener registered must be deregistered.

**4. Bounded caches**: LRU caches, size limits, time-based eviction.

**5. Weak references**: For caches that shouldn't keep objects alive (Java's WeakReference, Python's weakref).

## Real-World Example
**Long-running Java service**: Service runs for weeks, gradually slowing down. Heap dump reveals 10 million entries in a "session cache" — code added entries but never expired them. Fix: add LRU eviction or time-based expiry.

**JavaScript SPA**: Switching pages doesn't free memory. Each page registers event listeners on a global object but doesn't unregister on cleanup. Garbage collector can't collect old page components — they're "alive" through the listener chain.

**C server with periodic memory growth**: Valgrind reveals \`malloc(...)\` in error path missing \`free()\`. Fix: structure code with cleanup-on-error pattern (goto cleanup; or RAII).

## Interview Tips
- Know causes by language: GC languages still have leaks (held references), not just C/C++
- Mention specific tools (Valgrind, MAT, heap dumps)
- Caches without bounds = #1 production cause
- "Memory leaks" sometimes means "high memory usage" colloquially — distinguish!

## Common Follow-up Questions
1. Can GC languages have memory leaks? (Yes — when references unintentionally keep objects alive)
2. Difference between leak and high memory usage? (Leak: bounded growth that should be free but isn't. High usage: legitimate use, just a lot.)
3. How do you debug a memory leak? (Heap dump, profiler, look for objects that grow over time and identify retainers)`,

    'Critical Section': `## Definition
A **critical section** is a region of code that accesses shared resources (variables, data structures, files) and must NOT be executed by more than one thread/process simultaneously. The critical section problem is to design a protocol that ensures mutual exclusion, progress, and bounded waiting.

## Why It Matters
Almost every concurrent bug — race conditions, data corruption, lost updates — comes from improperly protected critical sections. Understanding the requirements and solutions is foundational for concurrent programming.

## Detailed Explanation

**The problem**:
\`\`\`
Thread A: counter++;  // critical section — accessing shared variable
Thread B: counter++;  // also critical section
\`\`\`

If both threads execute simultaneously, the result is undefined (race condition). Critical section protocol ensures only one is in the critical section at a time.

**Three requirements (Dijkstra)**:

**1. Mutual Exclusion**: At most one thread/process can be in its critical section at any time.

**2. Progress**: If no thread is in the critical section and some threads want to enter, one of them MUST be allowed to enter (no infinite blocking when CS is free).

**3. Bounded Waiting**: A thread waiting to enter the critical section must enter after a bounded number of other threads enter and leave (no starvation).

**Structure of a critical section solution**:
\`\`\`
do {
    entry_section();   // request access
    critical_section();  // shared resource access
    exit_section();    // release access
    remainder_section();  // non-critical work
} while (true);
\`\`\`

**Software solutions** (don't require hardware support):

**1. Peterson's Algorithm** (two threads):
\`\`\`
flag[0] = false; flag[1] = false; turn;

Thread i:
    flag[i] = true;
    turn = 1 - i;  // give other a chance
    while (flag[1-i] && turn == 1-i)
        ;  // wait
    // critical section
    flag[i] = false;
    // remainder
\`\`\`
Satisfies all three requirements. Correct on simple architectures but breaks on modern CPUs with reordering (without memory barriers).

**2. Bakery Algorithm (Lamport)**:
- Generalization to N threads
- Threads take "tickets"; lowest ticket goes first
- Bounded waiting guaranteed

**Hardware solutions** (more practical):

**1. Disable interrupts** (uniprocessor only):
- Simple — atomic by definition
- Doesn't work on multiprocessor
- Only kernel can do it

**2. Atomic instructions**:
- **Test-and-Set (TAS)**: Atomically test value and set to 1
- **Compare-and-Swap (CAS)**: Atomically compare value and swap if matches
- Foundation of locks, lock-free algorithms

**3. Spinlocks**: Built on atomic instructions.

**OS-level solutions**:

**1. Mutex**: Lock that puts threads to sleep when blocked. Most common solution.

**2. Semaphore**: Counter-based generalization. Binary semaphore = mutex.

**3. Monitor**: High-level construct (Java's synchronized). Encapsulates lock + condition variables.

**4. Readers-Writer locks**: For read-heavy critical sections.

**5. Lock-free / Wait-free algorithms**: No locks at all. Use atomic primitives. Highest performance but very hard to write.

**Common pitfalls**:

**1. Forgetting to release the lock**:
- Especially on exception paths
- Solution: RAII (C++), try-finally (Java/Python), defer (Go)

**2. Holding the lock too long**:
- Critical section = expensive operations → contention
- Keep critical sections SHORT

**3. Lock ordering inconsistency**: Causes deadlocks.

**4. Lock granularity wrong**:
- Too coarse: low concurrency
- Too fine: complex, error-prone, deadlock-prone

**5. Spurious wakeups**:
- \`wait()\` can wake up without notify — always use \`while\` loop, not \`if\`

## Real-World Example
**Banking application — account balance**:
\`\`\`java
synchronized (account) {
    if (account.balance >= amount) {
        account.balance -= amount;
    }
}
\`\`\`
The check + subtract must be atomic. Without synchronization, two simultaneous withdrawals could both pass the check, leading to overdraft.

**Multi-threaded counter**:
\`\`\`java
AtomicInteger counter = new AtomicInteger();
counter.incrementAndGet();  // CAS-based, no explicit critical section
\`\`\`
Atomic operation — CAS hardware instruction handles the critical section invisibly.

**Database row locking**: When you UPDATE a row, the database internally takes a lock — its critical section ensures consistent updates.

## Interview Tips
- Memorize the three requirements (mutex, progress, bounded waiting)
- Peterson's algorithm is classic — know its structure
- "Critical section" is the problem; "mutex/semaphore" are solutions
- Keep CS short — important practical advice

## Common Follow-up Questions
1. What are the three requirements? (Mutual exclusion, progress, bounded waiting)
2. Why doesn't disabling interrupts work on multiprocessors? (Other CPUs continue running)
3. What's the difference between mutex and critical section? (CS is the code area; mutex is one tool to protect it)`,

    "Belady's Anomaly": `## Definition
**Belady's Anomaly** is the counterintuitive phenomenon where increasing the number of page frames available to a process can INCREASE the number of page faults under certain page replacement algorithms (specifically FIFO). Named after László Bélády who discovered it in 1969.

## Why It Matters
Belady's Anomaly is a classic OS exam topic. It exposes deep flaws in FIFO replacement and motivates the use of "stack algorithms" (LRU, OPT). Understanding it shows you grasp the subtleties of page replacement.

## Detailed Explanation

**The expectation**: More page frames = fewer page faults. More memory = better performance. Seems obvious.

**The reality with FIFO**: Sometimes the opposite happens.

**Classic example**:
Reference string: \`1, 2, 3, 4, 1, 2, 5, 1, 2, 3, 4, 5\`

**With 3 frames (FIFO)**:
\`\`\`
Refs:  1  2  3  4  1  2  5  1  2  3  4  5
Frame: 1  1  1  4  4  4  5  5  5  5  5  5
       -  2  2  2  1  1  1  1  1  3  3  3
       -  -  3  3  3  2  2  2  2  2  4  4
Fault: F  F  F  F  F  F  F  -  -  F  F  -
\`\`\`
Total faults: **9**

**With 4 frames (FIFO)**:
\`\`\`
Refs:  1  2  3  4  1  2  5  1  2  3  4  5
Frame: 1  1  1  1  1  1  5  5  5  5  4  4
       -  2  2  2  2  2  2  1  1  1  1  5
       -  -  3  3  3  3  3  3  2  2  2  2
       -  -  -  4  4  4  4  4  4  3  3  3
Fault: F  F  F  F  -  -  F  F  F  F  F  -
\`\`\`
Total faults: **10**

**More frames → MORE faults**! Anomaly demonstrated.

**Why does it happen with FIFO**:
FIFO doesn't track usage — just age. With more frames, FIFO might keep "older" pages that aren't used anymore, evicting more recently used ones. Counterintuitively, smaller cache might evict less-useful pages.

**Stack algorithms — immune to Belady's anomaly**:
A page replacement algorithm is a "stack algorithm" if the set of pages in N frames is ALWAYS a SUBSET of the set in N+1 frames. Stack algorithms can't have Belady's anomaly.

**LRU is a stack algorithm**:
- With more frames, you keep MORE recently-used pages (a superset)
- So if LRU(N+1) doesn't have a fault, LRU(N) might, but LRU(N+1) can never have MORE
- Mathematical proof exists

**OPT is a stack algorithm**:
- Optimal — by definition, more frames can't help less

**FIFO is NOT a stack algorithm**:
- The pages in N frames may not be a subset of those in N+1 (different victim choices)
- Hence the anomaly

**Implications**:
- Don't use FIFO for page replacement in real systems
- LRU or its approximations (Clock) are robust to Belady's anomaly
- Real OSes use Clock variants for this reason

**Historical context**:
- Discovered in 1969, surprising at the time
- Disproved the natural assumption that more memory always helps
- Shaped subsequent algorithm design (favor LRU)

## Real-World Example
**Operating systems lab/exam scenario**: You're given a reference string and asked to compute page faults for FIFO with different frame counts. The "trick" example shows an anomaly. Demonstrates why FIFO isn't used.

**Real-world page replacement**: Real OSes use Clock algorithm (approximation of LRU), not FIFO — partly because of Belady's anomaly. Modern Linux uses a variant of Clock with two lists (active/inactive).

**Cache design lesson**: Designers of CPU caches, database buffer pools, and similar systems generally avoid pure FIFO and prefer LRU-like algorithms. Belady's anomaly is one reason.

## Interview Tips
- Be ready to compute page faults for FIFO at different frame counts
- Memorize the classic example (\`1,2,3,4,1,2,5,1,2,3,4,5\` with 3 vs 4 frames)
- Know "stack algorithm" terminology
- LRU and OPT immune; FIFO is not

## Common Follow-up Questions
1. Why is LRU immune? (Stack algorithm property — more frames = superset of pages)
2. What's a stack algorithm? (One where pages-in-N-frames ⊆ pages-in-(N+1)-frames)
3. Does LRU always have fewer faults than FIFO? (Generally yes, but not strictly always — depends on access pattern)`,

    'mmap': `## Definition
**mmap** (memory map) is a Unix system call that maps files or devices into memory, allowing them to be accessed as if they were ordinary memory. It provides a way to perform file I/O without explicit read/write syscalls — the kernel handles loading and saving pages on demand.

## Why It Matters
mmap is fundamental to modern OS operation — it backs shared libraries, executables, and high-performance file I/O. Understanding mmap explains how databases like SQLite and software like Lucene achieve extreme efficiency.

## Detailed Explanation

**Basic usage**:
\`\`\`c
#include <sys/mman.h>

int fd = open("data.bin", O_RDWR);
size_t length = 4096;
void* addr = mmap(NULL,           // let kernel pick address
                  length,         // bytes to map
                  PROT_READ | PROT_WRITE,  // permissions
                  MAP_SHARED,     // visible to other processes
                  fd,             // file descriptor
                  0);             // offset in file

// Now use addr as if it were a byte array
char* buf = (char*) addr;
buf[0] = 'A';  // writes to the file (deferred)

munmap(addr, length);
close(fd);
\`\`\`

**Mapping types**:

**1. File-backed mapping**:
- Maps a file into memory
- Reads/writes go to/from the file (lazily)
- Most common usage

**2. Anonymous mapping** (\`MAP_ANONYMOUS\`):
- Not backed by any file — just memory
- Useful for large allocations (alternative to malloc for huge buffers)
- malloc internally uses anonymous mmap for large sizes

**3. Shared mapping** (\`MAP_SHARED\`):
- Multiple processes can map the same file
- Changes visible to all processes
- Used for IPC (inter-process communication)
- Or: changes flushed to disk

**4. Private mapping** (\`MAP_PRIVATE\`):
- Copy-on-Write — initial reads are shared
- Writes create private copies (don't affect file or other processes)
- Used for executables (read-only code shared, modified data private)

**How mmap works**:
1. mmap creates an entry in the process's virtual address space
2. NO actual data loaded yet — pages are "lazy"
3. First access to a page → page fault
4. Kernel reads the page from disk into RAM
5. Updates page table — process can now access the page
6. Subsequent accesses are fast (no syscall overhead)

**Writing back**:
- Writes to mapped memory go to RAM first
- Eventually flushed to disk by the kernel (writeback)
- \`msync()\` to force flush
- On unmap or process exit, dirty pages flushed automatically

**mmap vs read/write**:

| Aspect | mmap | read/write |
|--------|------|------------|
| Syscall per access | No (only on page fault) | Yes (each call) |
| Memory copy | Avoided (zero-copy) | Required (kernel → user buffer) |
| Random access | Excellent | Less efficient (lseek + read) |
| Large files | Excellent (lazy) | Need explicit chunking |
| Small reads | Overhead per page (4 KB min) | Efficient |
| Sharing | Easy (MAP_SHARED) | Harder |
| API simplicity | Pointer arithmetic | Familiar fread/fwrite |

**Performance benefits**:
- **Zero-copy**: Data accessed directly from page cache (no copy to user buffer)
- **Lazy loading**: Only used pages actually loaded from disk
- **Shared across processes**: Multiple processes share same physical pages
- **Efficient random access**: Just dereference a pointer

**Use cases**:

**1. Loading executables and libraries**: When you run a program, the OS uses mmap to load the code (PRIVATE mapping with COW for data). Multiple instances share read-only code.

**2. Database storage**:
- SQLite uses mmap for some scenarios
- LMDB (used by OpenLDAP) uses mmap heavily
- Avoids serialization overhead

**3. Inter-process communication**: Shared anonymous mmap = shared memory between processes.

**4. Memory-efficient large file processing**:
- Lucene/Elasticsearch: mmap full-text indexes — kernel handles caching
- Search engines: index files mapped, kernel evicts cold parts

**5. Custom memory allocators**: malloc internally uses mmap for large allocations.

## Real-World Example
**SQLite database file**: Can be opened with mmap mode — SQLite maps the entire file into memory. Random reads anywhere in the file are essentially memory accesses, with the kernel paging in chunks as needed.

**Loading shared libraries**: When your program uses libc, libc.so is mmap'd into your process. Multiple programs share the same physical pages — one copy of libc in RAM serves all.

**Lucene full-text search**: Index files (potentially gigabytes) are mmap'd. Searches access them as memory; the OS pages in needed parts. Kernel page cache replaces explicit caching.

## Interview Tips
- mmap = file as memory, with lazy paging
- Zero-copy is a key performance benefit
- Anonymous mmap = malloc for huge allocations
- Mention real-world uses: SQLite, Lucene, executables

## Common Follow-up Questions
1. Why is mmap "zero-copy"? (Data accessed directly from page cache, no copy to user buffer)
2. mmap vs read/write — when prefer mmap? (Random access, large files, multiple processes share)
3. What's MAP_SHARED vs MAP_PRIVATE? (Shared: writes visible to all. Private: copy-on-write.)`,

    'Monolithic vs Microkernel': `## Definition
A **monolithic kernel** has all OS services (process management, memory, file systems, drivers, network) in one address space, running in privileged kernel mode. A **microkernel** has only essential services (IPC, basic scheduling, memory management) in kernel space; everything else (drivers, file systems, network) runs as user-space processes.

## Why It Matters
This is one of the great debates in OS design. The choice affects performance, stability, security, and complexity. Understanding both helps reason about Linux vs macOS vs Windows architectural choices.

## Detailed Explanation

**Monolithic kernel architecture**:
- ONE big kernel binary
- All services share kernel memory
- Components communicate via direct function calls
- All run in kernel mode (Ring 0)
- A bug anywhere can crash the whole kernel

**Microkernel architecture**:
- Tiny kernel — only essentials
- Other services as user-mode "servers"
- Components communicate via IPC (message passing)
- Most code runs in user mode
- A buggy driver/service crash is contained

**Comparison**:

| Aspect | Monolithic | Microkernel |
|--------|------------|-------------|
| Kernel size | Large (millions of lines) | Tiny (thousands) |
| Performance | Fast (direct calls) | Slower (IPC overhead) |
| Stability | Bug = whole kernel crash | Bug isolated to that server |
| Security | Wide attack surface in kernel | Smaller TCB (Trusted Computing Base) |
| Complexity | Many interacting components | Cleaner separation |
| Modularity | Loadable modules help | Inherent — services are processes |
| Examples | Linux, BSD, classic Unix | QNX, Minix, L4, GNU Hurd |

**The 1992 Tanenbaum-Torvalds debate**:
- Andrew Tanenbaum (Minix author) argued microkernels are the future
- Linus Torvalds (Linux author) defended monolithic design
- Famous Usenet flame war
- Both turned out partially right — monolithic dominates for performance but borrows microkernel ideas

**Hybrid kernels** (modern compromise):
- Combine ideas from both
- Some services in kernel mode (performance), some user mode (stability)
- Examples: Windows NT (and descendants), macOS (XNU = Mach + BSD)

**Performance differences**:

**Monolithic — direct call**:
\`\`\`
filesystem_function() → memory_function() → driver_function()
\`\`\`
All in same address space, just function calls. Nanoseconds.

**Microkernel — IPC**:
\`\`\`
filesystem_server → IPC → memory_server → IPC → driver_server
\`\`\`
Each call is a user-kernel-user transition + message copy. Microseconds.

This was a big deal historically — early microkernels (Mach 2.0) were slow. Modern microkernels (L4) reduced IPC overhead dramatically (~100 cycles), narrowing the gap.

**Stability differences**:

**Monolithic kernel panic**: A bug in a USB driver can crash the entire OS. Bluescreen of Death, kernel panic.

**Microkernel server crash**: USB server crashes, OS restarts it. Other services and applications continue. Self-healing systems possible.

**Linux's modular monolithic**:
- Linux is monolithic but supports loadable kernel modules
- Drivers can be loaded/unloaded at runtime
- Compromise — flexibility without true microkernel
- A buggy module still crashes the kernel

**Notable microkernel projects**:

**1. Mach (CMU, 1980s-90s)**: Influential research microkernel. Lives on in macOS XNU.

**2. L4 family**: Designed for performance. seL4 is formally verified.

**3. QNX**: Commercial microkernel. Used in BMW iDrive, Ford SYNC, medical devices.

**4. Minix**: Educational microkernel. Used inside Intel Management Engine (surprise!).

**5. GNU Hurd**: GNU's planned kernel (still in development since 1990!).

**Why monolithic won (for general-purpose)**:
- Performance was/is critical for desktops and servers
- Stability of monolithic kernels improved (loadable modules, hardware support)
- IPC overhead in microkernels was hard to overcome
- Linux's success cemented monolithic dominance in open source

**Why microkernels persist**:
- Embedded/safety-critical systems (cars, medical, military)
- Where reliability >> peak performance
- Verifiable correctness (seL4 — formally verified)
- Mobile / IoT trends toward smaller, isolated services

## Real-World Example
**Linux on a PC**: Monolithic. Network stack, filesystems, USB, display drivers — all in kernel space. One bad NVIDIA driver = kernel panic. But fast performance.

**QNX in BMW iDrive**: Microkernel. Audio service, navigation service, climate control — all user-mode servers. If audio service crashes, nav and climate continue. iDrive doesn't crash even if components fail.

**macOS — hybrid (XNU)**: Mach microkernel core + BSD monolithic components. I/O Kit (driver framework) somewhere between. Practical compromise.

**Windows NT — hybrid**: Executive Services (kernel mode — file systems, memory) + Subsystems (user mode — Win32, POSIX). Designed in 1993 with hybrid model.

**Mars rovers**: Used VxWorks (proprietary RTOS, microkernel-ish) for reliability. Stuck deep in space, you can't reboot easily — must avoid kernel panics at all costs.

## Interview Tips
- Tanenbaum vs Torvalds debate is fun history
- Linux is monolithic with modules — common nuance
- Modern systems are mostly hybrids (Windows NT, macOS XNU)
- QNX in cars is a great real-world microkernel example

## Common Follow-up Questions
1. Why are monolithic kernels faster? (Direct function calls vs IPC across processes)
2. Why are microkernels more stable? (Failures isolated to user-mode servers)
3. Is Linux a microkernel? (No — it's monolithic with loadable modules)`
  },

  'DBMS': {
    'ACID Properties': `## Definition
**ACID** is an acronym describing four properties that guarantee reliable database transactions: **Atomicity**, **Consistency**, **Isolation**, **Durability**. Together, they ensure that database operations behave correctly even in the face of crashes, power failures, and concurrent access.

## Why It Matters
ACID is the foundation of relational databases. Understanding it explains why databases are reliable, what trade-offs NoSQL databases make, and how transactions protect critical data (banking, e-commerce, healthcare).

## Detailed Explanation

**Atomicity** ("all or nothing"):
- A transaction is a single indivisible unit
- Either ALL operations succeed or NONE do
- If any part fails, the entire transaction is rolled back
- Example: bank transfer — debit and credit must both succeed or neither

**Consistency** ("valid state to valid state"):
- Transaction takes database from one valid state to another valid state
- All constraints, triggers, foreign keys remain satisfied
- If transaction would violate constraints → rolled back
- Example: account balance can't go negative (constraint); a transaction violating this aborts

**Isolation** ("concurrent transactions don't interfere"):
- Concurrent transactions appear to run as if they were sequential
- One transaction's intermediate state isn't visible to others
- Various isolation levels offer different guarantees (READ UNCOMMITTED, READ COMMITTED, REPEATABLE READ, SERIALIZABLE)
- Trade-off between isolation strength and performance

**Durability** ("once committed, stays committed"):
- Once a transaction commits, its changes survive crashes, power failures, etc.
- Data written to non-volatile storage (disk)
- Achieved via write-ahead logs (WAL) — log changes before applying

**The classic example — bank transfer**:
\`\`\`
BEGIN TRANSACTION;
  UPDATE accounts SET balance = balance - 100 WHERE id = 'A';
  UPDATE accounts SET balance = balance + 100 WHERE id = 'B';
COMMIT;
\`\`\`

ACID guarantees:
- **Atomicity**: If second UPDATE fails, first is rolled back. Money never disappears.
- **Consistency**: If A would go negative (constraint), transaction aborts.
- **Isolation**: Another transaction reading A and B sees them either both before or both after — never mid-transfer.
- **Durability**: Once COMMIT succeeds, even if server crashes, the change persists.

**How databases achieve ACID**:
- **Atomicity**: Transaction logs (undo logs) — can roll back partial changes
- **Consistency**: Constraint checking, foreign key validation
- **Isolation**: Locking, MVCC (Multi-Version Concurrency Control), snapshot isolation
- **Durability**: Write-Ahead Logging (WAL) — log to disk before applying

**ACID vs BASE (NoSQL trade-off)**:
- **ACID**: Strict guarantees, may sacrifice availability/scalability
- **BASE** (Basically Available, Soft state, Eventually consistent): NoSQL approach, prioritizes availability over strict consistency
- **CAP theorem**: In distributed systems, you can have at most 2 of Consistency, Availability, Partition tolerance
- Modern databases offer tunable trade-offs

## Real-World Example
**E-commerce order**: Place order → deduct inventory, charge card, create shipment record. ACID ensures: all three succeed or all roll back. No selling items you don't have, no charging without shipment.

**Banking**: ATM withdrawal involves debit, log, and dispense cash. Without ACID, crashes mid-transaction could lose money or duplicate transactions.

## Interview Tips
- Memorize all four — most asked DBMS question
- Have the bank transfer example ready
- Know how each is achieved (logs, locks, WAL)
- Mention BASE/CAP for NoSQL context

## Common Follow-up Questions
1. How is atomicity implemented? (Transaction logs, undo logs)
2. What's the difference between consistency in ACID and CAP? (ACID: constraints. CAP: replicas agree.)
3. How is durability achieved? (Write-ahead logging — log to disk before commit)`,

    'Normalization': `## Definition
**Normalization** is the process of organizing data in a relational database to minimize redundancy and dependency. It involves dividing tables into smaller, more manageable pieces and defining relationships between them, following a series of rules called **normal forms** (1NF, 2NF, 3NF, BCNF, etc.).

## Why It Matters
Poor normalization causes data anomalies — update anomalies, insertion anomalies, deletion anomalies. Understanding normalization is essential for designing schemas that are efficient, maintainable, and bug-free.

## Detailed Explanation

**The problem normalization solves**: Without normalization, you might have:
\`\`\`
| Order | Customer | Customer_Phone | Product | Price |
| 101   | Alice    | 555-1234       | Book    | 20    |
| 102   | Alice    | 555-1234       | Pen     | 5     |
| 103   | Bob      | 555-5678       | Book    | 20    |
\`\`\`

Problems:
- Alice's phone repeats (waste, inconsistency risk)
- If Alice changes phone, must update multiple rows
- Can't store a customer without an order
- Deleting last order deletes customer info

**Normal forms** (each builds on previous):

**1NF (First Normal Form)**:
- Each cell contains atomic (indivisible) values
- No repeating groups
- Each record is unique
- Example violation: storing comma-separated lists in one cell ("books, pens")
- Fix: Separate values into rows

**2NF (Second Normal Form)**:
- Must be in 1NF
- Every non-key column depends on the WHOLE primary key (no partial dependencies)
- Applies when you have composite primary keys
- Example: Order(OrderID, ProductID, ProductName) — ProductName depends only on ProductID, not the whole key
- Fix: Move ProductName to Products table

**3NF (Third Normal Form)**:
- Must be in 2NF
- No transitive dependencies (non-key columns depend only on the key, nothing else)
- Example: Employee(EmpID, DeptID, DeptName) — DeptName depends on DeptID, not EmpID
- Fix: Move DeptName to Departments table

**BCNF (Boyce-Codd Normal Form)**:
- Stricter version of 3NF
- Every determinant must be a candidate key
- Handles edge cases 3NF misses
- Most schemas aiming for 3NF naturally satisfy BCNF

**Higher forms (4NF, 5NF, 6NF)**:
- Address multi-valued and join dependencies
- Rarely needed in practice — most apps stop at 3NF/BCNF

**Normalized schema (3NF)**:
\`\`\`
Customers: (CustID, Name, Phone)
Orders: (OrderID, CustID, Date)
Products: (ProductID, Name, Price)
OrderItems: (OrderID, ProductID, Quantity)
\`\`\`

No redundancy, no anomalies. Each fact stored exactly once.

**Trade-offs**:

**Pros of normalization**:
- Less redundancy, less storage
- Update anomalies eliminated
- Data integrity easier to maintain
- Cleaner schema

**Cons**:
- More tables = more JOINs
- Read performance can suffer (need to combine tables)
- More complex queries

**Denormalization**:
- Deliberately introducing redundancy for performance
- Common in data warehouses (read-heavy)
- Common in NoSQL (document stores like MongoDB)
- Trade-off: faster reads vs harder updates

## Real-World Example
**E-commerce schema (3NF)**:
- Customers, Products, Orders, OrderItems, Categories, Reviews
- Each entity in its own table; relationships via foreign keys
- Updates are localized — change a product price in one place

**Data warehouse (denormalized)**:
- Star schema: large fact table with denormalized dimension data
- Optimized for analytical queries (read-heavy, batch updates)
- Sacrifices write efficiency for read speed

**MongoDB document**:
\`\`\`
{ orderId: 101, customer: { name: "Alice", phone: "555-1234" }, items: [...] }
\`\`\`
Embeds related data — fast reads, but customer info duplicated across orders.

## Interview Tips
- Memorize 1NF, 2NF, 3NF (BCNF if asked)
- Know the example violations and fixes
- Understand denormalization as a deliberate trade-off
- Mention "anomalies" — update, insertion, deletion

## Common Follow-up Questions
1. What's a transitive dependency? (Non-key depends on another non-key, not directly on PK)
2. When would you denormalize? (Read-heavy, analytics, performance-critical)
3. Difference between 3NF and BCNF? (BCNF stricter — every determinant must be a candidate key)`,

    'SQL Joins': `## Definition
**SQL JOINs** combine rows from two or more tables based on related columns. Different join types produce different result sets depending on which rows match and which don't. Understanding joins is fundamental to working with relational databases.

## Why It Matters
Joins are the most common operation in relational databases — and the most common source of confusing query results. Knowing each join type cold is essential for any backend developer.

## Detailed Explanation

**The four main join types**:

**1. INNER JOIN** (most common):
- Returns ONLY rows where the join condition matches in BOTH tables
- Rows without a match are excluded
- "Intersection" of the two tables

\`\`\`sql
SELECT *
FROM customers c
INNER JOIN orders o ON c.id = o.customer_id;
\`\`\`
Returns customers WITH orders. Customers without orders excluded.

**2. LEFT (OUTER) JOIN**:
- Returns ALL rows from the LEFT table
- Matching rows from the right table; NULL if no match
- Use to find "all X, with optional Y"

\`\`\`sql
SELECT *
FROM customers c
LEFT JOIN orders o ON c.id = o.customer_id;
\`\`\`
Returns ALL customers; orders if they exist, NULLs otherwise.

**3. RIGHT (OUTER) JOIN**:
- Mirror of LEFT — all rows from RIGHT table
- Less common (just rewrite as LEFT JOIN with tables swapped)

**4. FULL (OUTER) JOIN**:
- Returns ALL rows from BOTH tables
- NULLs where there's no match
- "Union" view — everything from both sides

\`\`\`sql
SELECT *
FROM customers c
FULL OUTER JOIN orders o ON c.id = o.customer_id;
\`\`\`

**Special joins**:

**5. CROSS JOIN** (Cartesian product):
- Every row from left × every row from right
- No join condition
- Result: N × M rows
- Rarely used directly; useful for generating combinations

**6. SELF JOIN**:
- Joining a table to itself
- Use cases: hierarchical data (employee + manager in same table)

\`\`\`sql
SELECT e.name, m.name AS manager
FROM employees e
LEFT JOIN employees m ON e.manager_id = m.id;
\`\`\`

**Visual (Venn diagrams)**:
- INNER JOIN = intersection only
- LEFT JOIN = left circle (with right's matches)
- RIGHT JOIN = right circle (with left's matches)
- FULL JOIN = both circles entirely

**Performance considerations**:

**Indexing**: Join columns should typically be indexed (or already be primary/foreign keys). Without indexes, joins do nested loop scans — O(N×M).

**Join algorithms** (database internals):
- **Nested Loop Join**: For each row in A, scan B. O(N×M). Good for small tables.
- **Hash Join**: Build hash table of smaller side, probe with larger. O(N+M). Good for equi-joins.
- **Merge Join**: Both sides sorted, then merged. O(N+M) after sort. Good for sorted data.

The query planner picks based on table sizes, indexes, and statistics.

**Common mistakes**:
- **Forgetting JOIN condition** → Cartesian product (rows explode)
- **Wrong direction in LEFT vs RIGHT** → wrong "outer" side
- **JOIN vs subquery confusion** → sometimes either works, performance differs
- **Multiple JOINs without considering order** → query planner usually handles, but order of conditions affects readability

**Multi-table joins**:
\`\`\`sql
SELECT c.name, p.title, oi.quantity
FROM customers c
JOIN orders o ON c.id = o.customer_id
JOIN order_items oi ON o.id = oi.order_id
JOIN products p ON oi.product_id = p.id
WHERE o.date > '2024-01-01';
\`\`\`

Common pattern — chain joins through intermediate tables.

## Real-World Example
**E-commerce report — customers and their orders**:
\`\`\`sql
-- All customers, with their order count (0 if none)
SELECT c.name, COUNT(o.id) AS order_count
FROM customers c
LEFT JOIN orders o ON c.id = o.customer_id
GROUP BY c.name;
\`\`\`
LEFT JOIN ensures customers with zero orders still appear.

**Analytics — products never ordered**:
\`\`\`sql
SELECT p.name
FROM products p
LEFT JOIN order_items oi ON p.id = oi.product_id
WHERE oi.product_id IS NULL;
\`\`\`
Classic "find unmatched" pattern using LEFT JOIN + IS NULL.

## Interview Tips
- Draw Venn diagrams to explain — visually intuitive
- Know when each is appropriate (LEFT for "all X plus optional Y")
- Mention indexes for performance
- "Forgetting join condition = Cartesian product" is a classic gotcha

## Common Follow-up Questions
1. Difference between INNER and LEFT JOIN? (INNER excludes non-matching; LEFT keeps left rows)
2. When use CROSS JOIN? (Generating combinations, rare in practice)
3. What's a self-join used for? (Hierarchical data — employee/manager in same table)`,

    'Indexes': `## Definition
A **database index** is a data structure that improves the speed of data retrieval operations on a table at the cost of additional space and slower writes. Indexes work like a book's index — instead of scanning every row, the database uses the index to find data quickly.

## Why It Matters
Indexes are THE primary tool for query performance optimization. A query that takes 10 seconds without an index can drop to 10 milliseconds with one. Understanding indexes is essential for any backend developer working with databases.

## Detailed Explanation

**How indexes work**:
- Index is a separate data structure (typically B-tree) sorted on indexed columns
- Database walks the index to find row locations
- Then fetches actual rows from the table
- Like a phonebook — sorted, allows binary search

**Without index** — full table scan:
\`\`\`
SELECT * FROM users WHERE email = 'alice@example.com';
\`\`\`
Database reads EVERY row, checks email. O(N) — slow for large tables.

**With index on email** — index lookup:
- Walk B-tree on email column to find Alice's row pointer in O(log N)
- Fetch the row
- Massive speedup for selective queries

**Common index types**:

**1. B-Tree Index** (default in most databases):
- Balanced tree, O(log N) lookup
- Supports equality (=) and range queries (<, >, BETWEEN)
- Default in MySQL, PostgreSQL, Oracle
- Works well for most cases

**2. Hash Index**:
- O(1) lookup for equality
- Doesn't support range queries
- Less common as default; available in PostgreSQL, MySQL Memory engine

**3. Bitmap Index**:
- For columns with low cardinality (few distinct values, e.g., gender, status)
- Used in data warehouses (Oracle)

**4. Full-Text Index**:
- For text searching ("contains word X")
- PostgreSQL: GIN/GiST indexes; MySQL: FULLTEXT; specialized: Elasticsearch

**5. Spatial Index** (R-tree):
- For geographic data — "find points within 5 km"
- PostgreSQL with PostGIS, MySQL spatial

**6. Composite (Multi-column) Index**:
- Index on multiple columns: \`CREATE INDEX idx ON users(last_name, first_name)\`
- Order matters! Useful for queries filtering on \`last_name\` or \`(last_name, first_name)\`
- NOT useful for queries on \`first_name\` alone (left-most prefix rule)

**7. Unique Index**:
- Enforces uniqueness on the indexed columns
- Same as PRIMARY KEY conceptually
- Allows NULL (unique allows multiple NULLs in most databases)

**8. Partial / Filtered Index**:
- Index only some rows (e.g., \`WHERE status='active'\`)
- Smaller index, faster updates
- PostgreSQL, SQL Server support this

**Costs of indexes**:
- **Storage**: Index data structures take space
- **Write performance**: INSERT/UPDATE/DELETE must update indexes too
- **Memory**: Frequently-used indexes should fit in RAM for speed

**When to add indexes**:
- Columns frequently in WHERE clauses
- Columns used in JOINs (foreign keys)
- Columns in ORDER BY (avoid sorting)
- Columns in GROUP BY

**When NOT to add indexes**:
- Tables with mostly writes, few reads
- Very small tables (full scan is faster)
- Columns with low selectivity (e.g., boolean — index won't help much)
- Already-indexed prefix of composite

**Common mistakes**:
- **Too many indexes**: Slow writes, bloated database
- **Indexing every column**: Defeats the purpose
- **Wrong column order in composite**: Doesn't match query patterns
- **Functions in WHERE break index use**: \`WHERE LOWER(email) = 'a@b'\` may not use email index

**Index-friendly queries**:
\`\`\`sql
-- Uses index on email
SELECT * FROM users WHERE email = 'a@b.com';

-- Uses composite index (last_name, first_name)
SELECT * FROM users WHERE last_name = 'Smith' AND first_name = 'John';
SELECT * FROM users WHERE last_name = 'Smith';

-- Does NOT use composite index (no last_name)
SELECT * FROM users WHERE first_name = 'John';
\`\`\`

**EXPLAIN — your friend**:
- Use \`EXPLAIN\` (PostgreSQL/MySQL) to see if index is used
- Look for "Index Scan" vs "Seq Scan"

## Real-World Example
**Slow query**: Login system queries \`SELECT * FROM users WHERE email = ?\` on a 10M-row table. Without index: 5 seconds (full scan). After \`CREATE INDEX ON users(email)\`: 2 ms.

**Composite index for sorting**: Blog showing posts by author by date:
\`\`\`sql
SELECT * FROM posts WHERE author_id = ? ORDER BY date DESC;
\`\`\`
Index on \`(author_id, date DESC)\` makes both filtering and sorting fast — no separate sort needed.

**Anti-pattern**: Adding index on every column "just to be safe" — destroys insert performance.

## Interview Tips
- B-tree is the default — know it
- Composite index left-most rule is a classic question
- Explain trade-off: read speed vs write speed/storage
- Mention EXPLAIN for diagnosis

## Common Follow-up Questions
1. What's the cost of an index? (Storage + slower writes + memory)
2. How does a B-tree index work? (Balanced tree, log N search)
3. Can multiple indexes be used in one query? (Yes — index intersection in many DBs)`,

    'B-Trees': `## Definition
A **B-Tree** is a self-balancing tree data structure that maintains sorted data and allows searches, insertions, and deletions in logarithmic time (O(log N)). It's the most common data structure for database indexes and filesystem metadata. The "B" stands for "balanced" (not "binary" — B-Trees can have many children per node).

## Why It Matters
B-Trees underlie almost every database index (MySQL InnoDB, PostgreSQL, Oracle, SQL Server, MongoDB) and many filesystems (NTFS, HFS+, ReiserFS). Understanding them explains why indexes are fast and why some queries can use them efficiently.

## Detailed Explanation

**Why B-Trees, not binary trees**:
- Binary trees: each node has 2 children, log₂ depth
- B-Trees: each node has many children (e.g., 100+), log₁₀₀ depth
- For 1 million keys: binary tree depth ~20; B-Tree depth ~3
- Each disk read = ~10 ms; fewer levels = faster

**Why the wide branching**:
- Designed for disk-based storage where each I/O is expensive
- Each node = one disk page (typically 4-16 KB)
- Pack many keys per node → fewer disk reads to find data
- Optimal for storage hierarchy (memory cheap, disk expensive)

**B-Tree properties** (for order m):
- Each node has at most m children
- Each non-leaf node (except root) has at least ⌈m/2⌉ children
- Root has at least 2 children (unless leaf)
- All leaves at same depth (balanced!)
- Keys within a node are sorted

**Operations**:

**Search**: O(log N)
1. Start at root
2. Find the right child to descend (linear/binary search within node)
3. Repeat until leaf or key found

**Insert**: O(log N)
1. Find the leaf where key belongs
2. Insert; if node overflows, split it
3. Promote middle key to parent
4. If parent overflows, split too — propagate up

**Delete**: O(log N)
1. Find and remove key
2. If node underflows, redistribute or merge with sibling
3. Propagate changes up if needed

**B+ Tree** (the actual database variant):
- All data stored in leaf nodes
- Internal nodes only have keys for navigation
- Leaves linked together (linked list) — efficient range scans!
- Used by MySQL InnoDB, PostgreSQL, etc.

**B-Tree vs B+ Tree**:

| Aspect | B-Tree | B+ Tree |
|--------|--------|---------|
| Data location | All nodes | Leaves only |
| Internal nodes | Keys + data | Keys only |
| Range queries | Multiple nodes | Linear leaf traversal |
| Used by | Some filesystems | Most databases |

**Range queries** (why B+ trees rock for databases):
\`SELECT * FROM users WHERE age BETWEEN 25 AND 35\`
1. Walk B+ tree to find first leaf with age >= 25
2. Follow leaf linked list right until age > 35
3. Sequential I/O — fast!

**Disk I/O analysis**:
- Database table: 100M rows
- Each B+ tree node: 100 keys
- Tree depth: log₁₀₀(100,000,000) = 4 levels
- Worst case: 4 disk reads to find any row
- Without index: read entire table — millions of pages

**Why not hash indexes for everything**:
- Hash: O(1) for equality, but no range queries, no sorted access
- B+ Tree: O(log N) but supports both equality and range
- Most queries need range/sort → B+ Tree wins overall

**Modern variants**:

**LSM Trees (Log-Structured Merge Trees)**:
- Used by RocksDB, LevelDB, Cassandra, MongoDB WiredTiger (alternative)
- Write-optimized: appends to log, merges into sorted files
- Faster writes, slower reads vs B-Trees
- Better for write-heavy workloads

**Fractal Trees, B-tree variants**: Other tree structures optimizing different trade-offs.

## Real-World Example
**MySQL InnoDB primary key index**: B+ Tree where leaf nodes contain the actual row data (clustered index). Searching by primary key is one tree traversal — extremely fast.

**Secondary indexes in InnoDB**: B+ Tree where leaves contain primary key (not full row). Search secondary index → get PK → search clustered index → get row. Two traversals.

**PostgreSQL btree index**: Default index type. Same B+ Tree structure. Powers most queries.

**Filesystem (NTFS)**: Master File Table organized as B+ Tree — fast file lookups.

## Interview Tips
- "B" is balanced, not binary
- Wide branching = fewer disk reads
- B+ Tree: data in leaves, leaves linked — range queries fast
- Most database indexes are B+ Trees, not B-Trees

## Common Follow-up Questions
1. Why not binary trees for indexes? (Too deep — many disk reads. B-Trees pack many keys per node.)
2. Difference between B-Tree and B+ Tree? (B+: data only in leaves, leaves linked)
3. When prefer LSM tree over B-Tree? (Write-heavy workloads — LSM optimized for writes)`,

    'Transactions': `## Definition
A **transaction** is a sequence of one or more database operations treated as a single logical unit of work. Transactions are either fully completed (committed) or fully undone (rolled back) — there's no partial state. They provide ACID guarantees for reliable database operations.

## Why It Matters
Transactions are how databases handle multi-step business operations safely. Without them, partial failures would corrupt data. Understanding transactions is essential for building reliable applications.

## Detailed Explanation

**Anatomy of a transaction**:
\`\`\`sql
BEGIN TRANSACTION;     -- start
  UPDATE accounts SET balance = balance - 100 WHERE id = 1;
  UPDATE accounts SET balance = balance + 100 WHERE id = 2;
COMMIT;                -- success — make permanent
-- OR
ROLLBACK;              -- failure — undo everything
\`\`\`

**Transaction lifecycle**:
1. **BEGIN/START**: Mark beginning of transaction
2. **Execute statements**: Changes are tentative
3. **COMMIT**: Make all changes permanent (durable)
4. **ROLLBACK**: Discard all changes (back to state before BEGIN)

**Implicit vs explicit**:
- Most databases run each statement as its own transaction by default (autocommit)
- Explicit transactions group multiple statements together
- Different drivers/ORMs handle this differently

**Savepoints** — partial rollback:
\`\`\`sql
BEGIN;
  INSERT INTO orders (...) VALUES (...);
  SAVEPOINT after_order;
  
  INSERT INTO order_items (...);
  -- something goes wrong
  ROLLBACK TO after_order;  -- undo just the items, keep the order
  
  -- try different items
  INSERT INTO order_items (...);
COMMIT;
\`\`\`

**Distributed transactions** (across multiple databases):
- **Two-Phase Commit (2PC)**: Coordinator asks all participants to prepare, then commit
- **Three-Phase Commit (3PC)**: Adds pre-commit phase for fault tolerance
- Slow and complex; modern systems often use Saga pattern instead

**Saga pattern** (microservices alternative):
- Series of local transactions with compensating actions
- If step 3 fails, undo steps 1 and 2 with their compensations
- Eventual consistency, not strict ACID
- Used in distributed systems

**Common transaction issues**:

**1. Long-running transactions**:
- Hold locks for a long time → blocks other transactions
- Bloat undo logs (if MVCC)
- Best practice: keep transactions SHORT

**2. Deadlocks**:
- Two transactions waiting for each other's locks
- Database detects via cycle detection in wait-for graph
- Aborts one (victim selection)
- Prevent via consistent lock ordering

**3. Lost updates**:
- T1 reads row, T2 reads same row, T1 writes, T2 overwrites with stale data
- Solutions: explicit locks (\`SELECT ... FOR UPDATE\`), optimistic concurrency

**4. Phantom reads**:
- Same query returns different rows in same transaction (because another transaction inserted)
- Fix: SERIALIZABLE isolation or range locks

**Transaction management in code**:

**Python with SQLAlchemy**:
\`\`\`python
session = Session()
try:
    session.add(order)
    session.add(order_item)
    session.commit()
except:
    session.rollback()
    raise
finally:
    session.close()
\`\`\`

**Java with Spring**:
\`\`\`java
@Transactional
public void placeOrder(Order order) {
    orderRepo.save(order);
    inventoryService.deduct(order);
    paymentService.charge(order);
    // any exception → automatic rollback
}
\`\`\`

**Best practices**:
- **Keep transactions short** — minimize lock duration
- **Don't perform external calls in transactions** — network is slow, locks held
- **Use appropriate isolation level** — SERIALIZABLE is safest but slowest
- **Handle deadlocks** — retry transaction on deadlock detection
- **Use connection pools** — transactions tie up connections

## Real-World Example
**Bank transfer**: Both debit and credit must succeed atomically. Without transactions, network failure mid-operation could lose or duplicate money.

**E-commerce checkout**: Order, inventory deduction, payment, shipping notification. Transaction ensures all succeed; if payment fails, inventory reverts.

**Saga in microservices**: \`PlaceOrder → ReserveInventory → ChargeCard → CreateShipment\`. If \`ChargeCard\` fails, compensating actions \`ReleaseInventory\` and \`CancelOrder\` undo prior steps. Eventually consistent.

## Interview Tips
- Transactions are about atomicity + consistency
- Keep them SHORT (most asked best practice)
- Distributed transactions are slow — Saga pattern often preferred
- Mention deadlocks as a common pitfall

## Common Follow-up Questions
1. Why keep transactions short? (Minimizes locks, reduces contention)
2. What's a deadlock and how do databases handle it? (Cycle detection, abort one transaction)
3. What's two-phase commit? (Distributed transaction protocol — prepare, then commit)`,

    'Isolation Levels': `## Definition
**Isolation levels** define how concurrent transactions interact with each other — what data one transaction can see while others are running. SQL standard defines four levels (READ UNCOMMITTED, READ COMMITTED, REPEATABLE READ, SERIALIZABLE) with increasing strictness and decreasing concurrency.

## Why It Matters
Choosing the wrong isolation level causes subtle, hard-to-reproduce bugs. Understanding the levels and their trade-offs is critical for any system handling concurrent transactions.

## Detailed Explanation

**The three concurrency anomalies** that isolation levels prevent:

**1. Dirty Read**: Reading uncommitted data from another transaction. If that transaction rolls back, you saw data that "never existed."
\`\`\`
T1: UPDATE balance = 0 WHERE id=1;  (not committed)
T2: SELECT balance WHERE id=1;       -- reads 0 (dirty)
T1: ROLLBACK;                         -- 0 was never real
\`\`\`

**2. Non-repeatable Read**: Reading the same row twice gets different values because another transaction modified and committed.
\`\`\`
T1: SELECT balance WHERE id=1;       -- returns 100
T2: UPDATE balance = 50 WHERE id=1; COMMIT;
T1: SELECT balance WHERE id=1;       -- returns 50 (changed!)
\`\`\`

**3. Phantom Read**: Re-running a query returns different rows because another transaction inserted/deleted.
\`\`\`
T1: SELECT * FROM users WHERE age > 18;  -- 100 rows
T2: INSERT INTO users (...) VALUES (age=25); COMMIT;
T1: SELECT * FROM users WHERE age > 18;  -- 101 rows (phantom!)
\`\`\`

**The four isolation levels**:

**1. READ UNCOMMITTED (lowest)**:
- Allows dirty reads
- Fastest, least locking
- Almost never used in practice (too risky)

**2. READ COMMITTED** (default in PostgreSQL, Oracle):
- Prevents dirty reads
- Allows non-repeatable reads and phantoms
- Each statement sees committed data only
- Good balance for many applications

**3. REPEATABLE READ** (default in MySQL InnoDB):
- Prevents dirty reads and non-repeatable reads
- Same query in transaction returns same rows
- May still allow phantoms (in standard; InnoDB uses snapshot isolation to prevent them)

**4. SERIALIZABLE (highest)**:
- Prevents all three anomalies
- Transactions appear to execute one after another
- Lowest concurrency — many locks or aborts
- Use for financial/critical systems

**Anomaly prevention table**:

| Level | Dirty Read | Non-repeatable | Phantom |
|-------|-----------|----------------|---------|
| READ UNCOMMITTED | ❌ | ❌ | ❌ |
| READ COMMITTED | ✅ | ❌ | ❌ |
| REPEATABLE READ | ✅ | ✅ | ❌ (or ✅ in InnoDB) |
| SERIALIZABLE | ✅ | ✅ | ✅ |

**How isolation is implemented**:

**Lock-based** (older databases, pessimistic):
- Read locks (shared) and write locks (exclusive)
- Higher isolation = more locking = more blocking

**MVCC (Multi-Version Concurrency Control)** (PostgreSQL, MySQL InnoDB, Oracle):
- Each transaction sees a snapshot of the database at a specific point in time
- Writers don't block readers; readers don't block writers
- Better concurrency
- Most modern databases use MVCC

**Snapshot Isolation**:
- A specific MVCC implementation
- Each transaction sees a consistent snapshot
- Prevents most anomalies but allows "write skew"
- PostgreSQL's default REPEATABLE READ is actually snapshot isolation

**Setting isolation level**:
\`\`\`sql
-- For one transaction
SET TRANSACTION ISOLATION LEVEL REPEATABLE READ;
BEGIN;
  -- queries
COMMIT;

-- Per-session default
SET SESSION TRANSACTION ISOLATION LEVEL SERIALIZABLE;
\`\`\`

**Trade-offs**:
- **Higher isolation** → safer but slower (more locks/aborts)
- **Lower isolation** → faster but more bugs possible
- **Default is usually fine** for most applications (READ COMMITTED or REPEATABLE READ)
- **SERIALIZABLE** when correctness > performance

## Real-World Example
**E-commerce inventory**:
\`\`\`
T1: SELECT stock FROM products WHERE id=42;  -- returns 5
T1: SELL the item;  (not committed)
T2: SELECT stock;  -- READ COMMITTED returns 5
T2: SELL it too;
T1: COMMIT;
T2: COMMIT;  -- oversold! both bought from stock of 5
\`\`\`
Fix: \`SELECT stock FOR UPDATE\` (locks the row) or use SERIALIZABLE.

**Banking — concurrent transfers**:
- Should use SERIALIZABLE or explicit locks
- Trading some performance for absolute correctness
- Critical: no double-spending, no lost money

**Web app session counter**:
- Probably READ COMMITTED is fine — slight staleness OK
- Don't waste resources on SERIALIZABLE for non-critical data

## Interview Tips
- Memorize the anomaly table (which level prevents which anomaly)
- Know your database's default (PostgreSQL: READ COMMITTED, MySQL: REPEATABLE READ)
- MVCC is the modern implementation — mention it
- Higher isolation = more correctness, less performance

## Common Follow-up Questions
1. What's the difference between non-repeatable read and phantom? (Same row changes vs different rows appear)
2. What's MVCC? (Multi-version — each transaction sees a snapshot)
3. Why isn't SERIALIZABLE always the default? (Performance — too restrictive for most use cases)`,

    'Primary Foreign Key': `## Definition
A **primary key** is a column (or combination of columns) that uniquely identifies each row in a table. A **foreign key** is a column in one table that references the primary key of another table, establishing a relationship and enforcing referential integrity.

## Why It Matters
Keys are the foundation of relational databases. Primary keys enable efficient lookups; foreign keys enforce data integrity across tables. Together they're the structural backbone of any relational schema.

## Detailed Explanation

**Primary Key (PK)**:
- Uniquely identifies each row
- Cannot be NULL
- Cannot be duplicated
- One per table (composite or single column)
- Automatically indexed (clustered index in many DBs)

**Common primary key types**:
- **Auto-increment integer**: \`id INT AUTO_INCREMENT PRIMARY KEY\` — simple, fast
- **UUID**: \`id UUID PRIMARY KEY\` — globally unique, harder to guess, slightly slower indexes
- **Natural key**: Real-world identifier (e.g., email, ISBN) — risky if it changes
- **Composite key**: Multiple columns combined (e.g., (order_id, product_id) in OrderItems)

**Surrogate vs Natural keys**:
- **Surrogate**: Artificial (auto-increment ID, UUID). Stable, never changes.
- **Natural**: From real world (SSN, email, ISBN). Meaningful but risky.
- **Best practice**: Use surrogate key as PK, add unique constraints on natural keys.

**Foreign Key (FK)**:
- Column referring to PK of another table (or unique key)
- Enforces referential integrity — can't reference a non-existent row
- Can be NULL (unless declared NOT NULL)

**Example**:
\`\`\`sql
CREATE TABLE customers (
  id INT PRIMARY KEY,
  name VARCHAR(100)
);

CREATE TABLE orders (
  id INT PRIMARY KEY,
  customer_id INT,
  amount DECIMAL,
  FOREIGN KEY (customer_id) REFERENCES customers(id)
);
\`\`\`

\`orders.customer_id\` MUST reference an existing \`customers.id\`. Database enforces this.

**Foreign key actions** (what happens when referenced row is deleted/updated):
- **CASCADE**: Delete/update ripples to dependent rows. Order deleted when customer deleted.
- **SET NULL**: Set FK to NULL when parent deleted.
- **RESTRICT / NO ACTION**: Prevent deletion if referenced. Default in many DBs.
- **SET DEFAULT**: Set FK to default value.

\`\`\`sql
FOREIGN KEY (customer_id) REFERENCES customers(id)
  ON DELETE CASCADE
  ON UPDATE CASCADE;
\`\`\`

**Composite Foreign Key**: Reference composite primary keys.

**Why use foreign keys**:
- **Data integrity**: Can't have orphan orders pointing to non-existent customers
- **Documentation**: Schema clearly shows relationships
- **Cascading operations**: Auto-delete dependents
- **Optimization**: DB engine knows about relationships

**When NOT to use foreign keys**:
- Some scaled-out / sharded systems disable FKs for performance
- Logical FKs (referenced in code, not enforced) sometimes used
- High-write workloads where FK validation is costly
- Generally: enforce FKs unless you have a specific scaling reason not to

**Primary Key best practices**:
- Use surrogate keys (auto-increment or UUID)
- Keep PKs short — they're used in indexes everywhere
- Don't change PK values once set
- Don't expose internal PKs in URLs (security/privacy concern — use UUIDs or slugs)

**Foreign Key best practices**:
- Always index FK columns (most DBs don't auto-index them)
- Decide cascade behavior thoughtfully — CASCADE can chain unexpectedly
- Use NOT NULL when relationship is required (e.g., order MUST have customer)

**Indexes and keys**:
- PK auto-creates a unique index (clustered in InnoDB)
- FK does NOT auto-create an index in most databases (MySQL exception)
- Always manually index FK columns — JOINs will be slow without it

## Real-World Example
**E-commerce schema**:
\`\`\`sql
customers(id PK, name, email)
orders(id PK, customer_id FK→customers.id, date)
order_items(order_id FK→orders.id, product_id FK→products.id, qty,
            PRIMARY KEY (order_id, product_id))  -- composite PK
products(id PK, name, price)
\`\`\`

\`order_items\` has composite PK and two FKs. Deleting a customer cascades to orders, then to order_items.

**UUID for distributed systems**: When multiple servers create records, auto-increment causes collisions. UUIDs (or Snowflake IDs) ensure uniqueness without coordination.

**Logical FK in microservices**: User service has users; Order service has orders with userId. Order service references userId but no DB-level FK (different databases). Application enforces consistency.

## Interview Tips
- PK = unique + not null + one per table
- FK = enforces relationship, can be NULL
- Always index FK columns
- Surrogate keys (auto-increment, UUID) preferred over natural

## Common Follow-up Questions
1. Can a table have multiple primary keys? (No — one PK per table; can have multiple unique constraints)
2. Composite primary key vs surrogate key? (Surrogate is simpler; composite has business meaning)
3. Why isn't FK auto-indexed? (Historical decision; always add manually for JOIN performance)`,

    'NoSQL vs SQL': `## Definition
**SQL databases** (relational) store structured data in tables with predefined schemas, support ACID transactions, and use SQL for queries. **NoSQL databases** are diverse — document stores, key-value stores, wide-column stores, graph databases — typically offering schema flexibility, horizontal scaling, and BASE consistency model instead of ACID.

## Why It Matters
Choosing between SQL and NoSQL is a fundamental architecture decision. Understanding the trade-offs helps pick the right tool for the job.

## Detailed Explanation

**SQL (Relational) databases**:
- Examples: MySQL, PostgreSQL, Oracle, SQL Server, SQLite
- Predefined schema with tables, rows, columns
- ACID transactions
- SQL query language (standardized)
- Vertical scaling primarily
- Strong consistency
- Mature, well-understood

**NoSQL databases — four main types**:

**1. Document stores** (MongoDB, CouchDB, Firestore):
- Store JSON-like documents
- Flexible schema (schemaless or schema-on-read)
- Good for: nested data, varying fields, rapid prototyping
- Example: \`{ id: 1, name: "Alice", orders: [{...}, {...}] }\`

**2. Key-value stores** (Redis, DynamoDB, Memcached):
- Simple key-value pairs
- Extremely fast (in-memory often)
- Good for: caching, sessions, simple lookups
- Example: \`SET user:1 "Alice"; GET user:1 → "Alice"\`

**3. Wide-column stores** (Cassandra, HBase, ScyllaDB):
- Rows have flexible columns; sparse data
- Good for: time-series, IoT, write-heavy workloads
- Designed for massive scale across data centers

**4. Graph databases** (Neo4j, ArangoDB, Amazon Neptune):
- Nodes and edges
- Good for: social networks, recommendation engines, fraud detection
- Excels at relationship queries (\`friends of friends of friends\`)

**Comparison**:

| Aspect | SQL | NoSQL |
|--------|-----|-------|
| Schema | Fixed (predefined) | Flexible |
| Scaling | Vertical primarily | Horizontal (sharded) |
| Consistency | Strong (ACID) | Often eventual (BASE) |
| Transactions | Multi-row, multi-table | Limited (often single-doc) |
| Query language | SQL (standardized) | Varies per DB |
| Joins | Native, powerful | Limited or app-side |
| Maturity | Decades old | Newer, evolving |
| Best for | Structured data, complex relationships | Flexible data, massive scale |

**ACID vs BASE**:
- **ACID** (SQL): Atomicity, Consistency, Isolation, Durability — strict guarantees
- **BASE** (NoSQL): Basically Available, Soft state, Eventually consistent — looser

**CAP theorem**:
- In distributed systems: pick 2 of Consistency, Availability, Partition tolerance
- SQL typically CP (consistent, partition-tolerant — sacrifices availability)
- Many NoSQL: AP (available, partition-tolerant — sacrifices strong consistency)

**When to use SQL**:
- Complex relationships and joins
- Need ACID transactions (financial, healthcare)
- Structured data with well-defined schema
- Reporting and analytics with complex queries
- Smaller-to-medium scale (millions of rows fine)

**When to use NoSQL**:
- Massive scale (billions of records, high throughput)
- Flexible/evolving schema
- Specific access patterns (key-value lookup, document access)
- Specific data shapes (graphs, time-series, geo)
- Eventual consistency acceptable

**Hybrid / Polyglot persistence**:
- Use multiple databases for different needs
- Example: PostgreSQL for users + orders, Redis for sessions, Elasticsearch for search, Cassandra for analytics
- Modern best practice for large systems

**NewSQL** (best of both):
- CockroachDB, Spanner, YugabyteDB, TiDB
- SQL interface + horizontal scalability
- Stronger consistency than typical NoSQL
- Good for global, scale-out applications

**Common misconceptions**:
- "NoSQL is faster" — only for specific access patterns; SQL can be faster otherwise
- "NoSQL means no schema" — most have implicit schemas; flexibility ≠ chaos
- "NoSQL doesn't support transactions" — modern NoSQL increasingly does (MongoDB transactions, Cosmos DB)

## Real-World Example
**E-commerce architecture**:
- **Users, orders, products**: PostgreSQL (relational data, ACID)
- **Product catalog search**: Elasticsearch (full-text)
- **Shopping cart**: Redis (fast, in-memory, TTL)
- **Logs and metrics**: Cassandra or InfluxDB (write-heavy, time-series)
- **Recommendations**: Neo4j (graph relationships)

Each database does what it's best at.

**Twitter / X**: Uses many databases — relational for users, NoSQL for tweets at scale, Redis for caching.

**Instagram**: Started with PostgreSQL, scaled by sharding. Uses Cassandra for some data, Redis for cache.

## Interview Tips
- Don't say "NoSQL is better" — context matters
- Know the four NoSQL types: document, key-value, wide-column, graph
- Polyglot persistence is the modern answer
- ACID vs BASE, CAP theorem are common follow-ups

## Common Follow-up Questions
1. CAP theorem? (Pick 2 of Consistency, Availability, Partition tolerance)
2. When use document store vs key-value? (Document: complex nested data. KV: simple lookups.)
3. Can NoSQL do transactions? (Increasingly yes — MongoDB 4.0+ supports multi-document)`,

    'Database Sharding': `## Definition
**Sharding** is a database scaling technique that horizontally partitions data across multiple database servers. Each server (shard) holds a subset of the data, allowing the system to handle more load and store more data than a single server could.

## Why It Matters
When a single database can't handle the load, sharding is one of the main solutions. Understanding sharding strategies and trade-offs is crucial for designing large-scale systems.

## Detailed Explanation

**Why shard**:
- **Storage limits**: Single server has finite disk
- **CPU/RAM limits**: Single server has finite compute
- **Throughput**: More servers = more concurrent requests handled
- **Geographic distribution**: Place data near users

**Vertical scaling vs sharding**:
- **Vertical (scale up)**: Bigger server. Easy but expensive and limited.
- **Sharding (scale out)**: Many servers. Complex but virtually unlimited.

**Sharding strategies**:

**1. Range-based sharding**:
- Split by ranges of a key (e.g., user IDs 1-1M on shard 1, 1M-2M on shard 2)
- Simple and predictable
- **Problem**: Hot spots — if recent IDs are most active, last shard gets all the load

**2. Hash-based sharding**:
- Hash the shard key, use modulo to pick shard
- \`shard = hash(user_id) % num_shards\`
- Even distribution
- **Problem**: Adding shards requires rehashing everything (mitigated by consistent hashing)

**3. Consistent hashing**:
- Hashes both keys and shards onto a ring
- Adding/removing shards only redistributes a fraction of data
- Used by DynamoDB, Cassandra
- More complex but scales better

**4. Geographic / Directory-based sharding**:
- A lookup service tracks which shard has each piece of data
- Flexible — can move data freely
- Adds a lookup hop and a single point of failure

**5. Tenant-based sharding (multi-tenancy)**:
- One shard per customer (or group)
- Common in SaaS — tenant isolation, easy compliance

**Choosing the shard key** (most critical decision):
- Should distribute load evenly
- Should align with query patterns (avoid cross-shard queries)
- Once chosen, hard to change (massive data migration)
- Common: user_id, customer_id, date, hash combinations

**Cross-shard problems**:

**1. Cross-shard queries**:
- "Find all orders" requires querying every shard, then merging
- Slow and complex
- Best to design queries to hit single shard

**2. Cross-shard joins**:
- Joining tables on different shards is expensive
- Often have to do client-side joins or denormalize

**3. Cross-shard transactions**:
- ACID across shards is HARD
- Two-phase commit slow
- Saga pattern for eventually consistent

**4. Resharding** (changing shard count):
- Adding shards may require massive data migration
- Consistent hashing minimizes this
- Plan for it from the start

**Common sharding architectures**:

**Application-level sharding**:
- App code knows which shard to query
- Maximum control, maximum complexity
- Used by Instagram, Pinterest

**Middleware sharding (proxy)**:
- App talks to proxy; proxy routes to correct shard
- Examples: Vitess (MySQL), ProxySQL, ShardingSphere
- Easier app code

**Database-level sharding**:
- DB handles sharding transparently
- Examples: MongoDB sharded clusters, Cassandra (auto-shards), CockroachDB
- Easiest but less control

**Replication vs sharding**:
- **Replication**: Same data on multiple servers (HA, read scaling)
- **Sharding**: Different data on different servers (write/storage scaling)
- Often combined — each shard is replicated

**Common pitfalls**:
- **Choosing wrong shard key** — uneven distribution, hard to fix
- **Cross-shard queries dominating** — defeats purpose of sharding
- **Hotspots** — one shard gets disproportionate load
- **Not planning for resharding** — rigid setup, painful to grow

**When to shard**:
- Single DB can't handle load (>1 TB, >10K QPS often)
- Geographic distribution needed
- Very large user base or data volume

**Avoid sharding if you can**:
- Sharding adds enormous complexity
- Try vertical scaling, read replicas, caching, query optimization first
- Only shard when you've exhausted other options

## Real-World Example
**Instagram's sharding (Postgres)**: 
- Sharded by user ID
- Each shard is a Postgres instance
- Application-level sharding logic
- Handles billions of users

**MongoDB sharded cluster**:
- Built-in sharding
- Config servers track shard mapping
- Mongos routers route queries

**DynamoDB**: 
- Auto-sharded by partition key
- Consistent hashing internally
- Transparent to user — picks key well or face hotspots

**Notion**: Uses Postgres with custom sharding for blocks/databases.

## Interview Tips
- Sharding is HARD — don't recommend it casually
- Choosing the shard key is the most important decision
- Consistent hashing is the elegant solution to resharding
- Read replicas + caching first; shard only if necessary

## Common Follow-up Questions
1. What's a hot shard? (Disproportionate load on one shard due to bad key choice)
2. What's consistent hashing? (Hash keys and shards onto a ring; minimizes redistribution on resize)
3. Sharding vs partitioning? (Often used interchangeably; partitioning sometimes means within one DB, sharding across servers)`,

    'Replication': `## Definition
**Database replication** is the process of copying data from one database server (primary/master) to one or more other servers (replicas/slaves). Replication provides high availability, read scalability, disaster recovery, and geographic distribution.

## Why It Matters
Replication is the most common database scaling and reliability technique. Understanding it is essential for designing fault-tolerant, high-performance systems.

## Detailed Explanation

**Why replicate**:
- **High availability**: Primary fails → replica takes over
- **Read scaling**: Many replicas serve read traffic
- **Disaster recovery**: Geographic replicas survive datacenter failures
- **Reduced latency**: Users read from nearest replica
- **Backup**: Replica as live backup
- **Analytics offloading**: Run heavy reports on replica without affecting primary

**Replication topologies**:

**1. Primary-Replica (Master-Slave)**:
- One primary handles all writes
- Multiple replicas for reads
- Simplest, most common

**2. Primary-Primary (Master-Master)**:
- Multiple servers accept writes
- Conflicts must be resolved
- Complex but allows write scaling

**3. Multi-region / Geographic**:
- Replicas in different regions
- Users connect to nearest
- Eventual consistency typically

**4. Cluster / Quorum-based**:
- Multiple nodes, write to majority
- Examples: Cassandra, MongoDB replica sets, etcd
- Built-in failover

**Replication modes**:

**1. Synchronous replication**:
- Primary waits for replica(s) to confirm before acknowledging write
- Strong consistency — replica always up-to-date
- **Cost**: Higher write latency, primary blocks if replica slow

**2. Asynchronous replication**:
- Primary acknowledges write before replica confirms
- Lower latency, higher throughput
- **Risk**: Replica can lag; if primary crashes before replication, data lost

**3. Semi-synchronous**:
- Wait for at least one replica to confirm (others async)
- Compromise — better durability than async, faster than full sync

**Implementation methods**:

**1. Statement-based replication**:
- Replicate the SQL statements
- Smaller logs, but non-deterministic functions (NOW(), RAND()) cause issues

**2. Row-based replication**:
- Replicate the actual changed rows
- Larger logs, but reliable and deterministic
- MySQL default mode now

**3. Logical replication**:
- Replicate at row/table level via change feeds
- Selective — pick what to replicate
- PostgreSQL logical replication, Debezium

**4. Physical replication / WAL shipping**:
- Replicate the binary write-ahead log
- Whole database replicated; replica is byte-identical
- Faster, simpler, but tightly coupled

**Replication lag**:
- Replica falls behind primary
- Caused by: high write rate, slow network, busy replica
- Read-from-replica may return stale data
- Monitor lag — alert if too high

**Read-after-write consistency**:
- User writes data, immediately reads — should see their write
- With async replication, reading from replica may show OLD data
- Solutions:
  - Read from primary for short period after write (sticky session)
  - Use primary for reads in same session
  - Wait for replication to confirm

**Failover**:
- Primary fails — replica promoted to primary
- **Manual failover**: Operator triggers, slower but safer
- **Automatic failover**: System detects failure, promotes — needs careful design (split-brain risk)
- **Tools**: Patroni for PostgreSQL, MySQL Group Replication, Orchestrator

**Split-brain problem**:
- Network partition: two servers think they're primary
- Both accept writes — conflicting data
- Solutions: quorum (need majority), STONITH (Shoot The Other Node In The Head)

**Replication vs sharding**:
- **Replication**: Same data on many servers (HA, read scaling)
- **Sharding**: Different data on different servers (write/storage scaling)
- Often combined — each shard replicated

**Modern systems**:
- **PostgreSQL**: Streaming replication, logical replication
- **MySQL**: Binary log replication, Group Replication, InnoDB Cluster
- **MongoDB**: Replica sets (built-in HA, automatic failover)
- **Cassandra**: Tunable consistency, multi-region replication built-in
- **Cloud-managed**: AWS RDS Multi-AZ, Aurora, Cloud SQL — abstracts away complexity

## Real-World Example
**Web app with read replicas**:
- 1 primary (writes), 3 replicas (reads)
- Application connects to primary for writes, load-balances reads across replicas
- Common architecture for medium-scale apps

**Multi-region for global apps**:
- Primary in US, replicas in EU and Asia
- EU users read from EU replica (low latency)
- Writes go to primary (cross-region latency, but rarer)
- Eventual consistency between regions

**Aurora Multi-Master**:
- AWS Aurora supports multiple writers
- Conflict resolution at row level
- Higher write throughput

**Disaster recovery**:
- Primary in US-East, async replica in US-West
- US-East datacenter goes down → US-West takes over
- Some data loss possible (replica lag) but business continues

## Interview Tips
- Replication = same data on many servers; Sharding = different data on different servers
- Async vs sync replication is a key trade-off
- Replication lag is the main async issue
- Failover and split-brain are critical concerns

## Common Follow-up Questions
1. Async vs sync replication? (Speed vs durability)
2. What's split-brain and how prevent it? (Two primaries; quorum-based decisions prevent)
3. How handle replication lag? (Read from primary if stale data unacceptable, or use causal consistency)`,

    'Stored Procedures': `## Definition
A **stored procedure** is a set of SQL statements stored in the database that can be invoked by name. Stored procedures encapsulate business logic at the database level, enabling reuse, security, performance optimization, and reducing network round trips.

## Why It Matters
Stored procedures were the standard pattern for database logic for decades. Modern best practices often favor application-layer logic, but understanding stored procedures is important for working with legacy systems and specific use cases (high-performance, security-sensitive, batch operations).

## Detailed Explanation

**Basic structure** (PostgreSQL example):
\`\`\`sql
CREATE PROCEDURE transfer_money(
  IN from_id INT,
  IN to_id INT,
  IN amount DECIMAL
)
LANGUAGE plpgsql
AS $$
BEGIN
  UPDATE accounts SET balance = balance - amount WHERE id = from_id;
  UPDATE accounts SET balance = balance + amount WHERE id = to_id;
END;
$$;

-- Call it
CALL transfer_money(1, 2, 100);
\`\`\`

**Stored procedures vs functions**:
- **Procedures**: Don't necessarily return values; can have OUT parameters; can manage transactions
- **Functions**: Return values; usable in queries (SELECT my_func(x)); generally side-effect-free

**Components**:
- **Parameters**: IN, OUT, INOUT
- **Variables**: Local variables for computation
- **Control flow**: IF, LOOP, WHILE
- **Cursors**: Iterate through query results
- **Error handling**: TRY/CATCH-like blocks
- **Return values**: Functions return values; procedures may use OUT params

**Languages**:
- PostgreSQL: PL/pgSQL, PL/Python, PL/Perl, others
- MySQL: SQL with procedural extensions
- Oracle: PL/SQL
- SQL Server: T-SQL

**Advantages**:

**1. Performance**:
- Compiled and cached by the database
- Reduced network round trips (one call vs many queries)
- Database can optimize execution plan

**2. Reusability**:
- Define logic once, call from multiple applications
- Consistent business rules across all clients

**3. Security**:
- Grant EXECUTE permission without giving direct table access
- Hide schema from application
- Prevent SQL injection (parameterized)

**4. Encapsulation**:
- Complex logic stays in DB
- Database becomes the source of truth for business rules

**5. Atomicity**:
- Multiple operations in one transactional unit
- Easier to ensure consistency

**Disadvantages**:

**1. Vendor lock-in**:
- PL/SQL doesn't run on PostgreSQL
- Switching databases means rewriting

**2. Difficult to version control**:
- Code lives in DB, not in source repo (without effort)
- Migrations and updates are awkward
- Modern: tools like Flyway, Liquibase help

**3. Hard to test**:
- Can't easily unit test in CI/CD
- Need a real database

**4. Hard to debug**:
- Limited debugging tools compared to application code
- Stack traces less helpful

**5. Skill silo**:
- Application developers may not know DB-specific languages
- Specialized DBA skills needed

**6. Limited expressiveness**:
- Modern languages have richer libraries
- Hard to call external services from DB

**7. Scalability**:
- Logic in DB harder to scale than stateless app servers

**Modern best practice**:
- **Default to application-layer logic** — Java, Python, Node.js for business rules
- **Use stored procedures sparingly** — for performance-critical operations or atomic batch operations
- **Trigger-heavy designs are an anti-pattern** in modern apps
- **NoSQL alternatives**: client-side queries, change streams, materialized views

**When stored procedures shine**:
- Bulk data operations (process millions of rows in DB)
- Security-sensitive logic that must run server-side
- Legacy systems that already use them
- Performance-critical operations where round trips kill performance

**Triggers** (related concept):
- Code that runs automatically on INSERT/UPDATE/DELETE
- Useful for auditing, validation, derived data
- Heavy use can be confusing — "spooky action at a distance"

## Real-World Example
**Banking transfer in stored procedure**:
\`\`\`sql
CREATE PROCEDURE transfer(IN from_id INT, IN to_id INT, IN amount DECIMAL) AS $$
BEGIN
  IF (SELECT balance FROM accounts WHERE id = from_id) < amount THEN
    RAISE EXCEPTION 'Insufficient funds';
  END IF;
  
  UPDATE accounts SET balance = balance - amount WHERE id = from_id;
  UPDATE accounts SET balance = balance + amount WHERE id = to_id;
  INSERT INTO transactions (from_id, to_id, amount) VALUES (from_id, to_id, amount);
END;
$$ LANGUAGE plpgsql;
\`\`\`
All-or-nothing operation, runs in DB, single network call.

**Modern alternative**:
\`\`\`python
@transaction.atomic
def transfer(from_id, to_id, amount):
    from_account = Account.objects.select_for_update().get(id=from_id)
    if from_account.balance < amount:
        raise InsufficientFundsError()
    from_account.balance -= amount
    from_account.save()
    Account.objects.filter(id=to_id).update(balance=F('balance') + amount)
    Transaction.objects.create(from_id=from_id, to_id=to_id, amount=amount)
\`\`\`
More testable, version-controlled, language-agnostic.

## Interview Tips
- Know advantages (performance, security, reusability) and disadvantages (lock-in, hard to test)
- Modern preference is application-layer logic, but stored procs still have niche uses
- Triggers are related — and often considered an anti-pattern when overused

## Common Follow-up Questions
1. Stored procedure vs function? (Procedure: may not return; Function: returns value, usable in queries)
2. Why are stored procedures less popular now? (Hard to test/version-control; ORM/app-layer alternatives)
3. When would you use a stored procedure? (Bulk data ops, security-critical logic, performance-critical)`,

    'Database Triggers': `## Definition
A **trigger** is a special kind of stored procedure that automatically executes (fires) in response to specific events on a table — INSERT, UPDATE, or DELETE. Triggers run in the same transaction as the triggering operation, providing a way to automatically enforce rules, log changes, or maintain derived data.

## Why It Matters
Triggers are powerful but easy to misuse. They can enforce data integrity beyond constraints, automate auditing, and maintain denormalized data — but heavy reliance on triggers leads to "spooky action at a distance" that's hard to debug. Knowing when to use them is essential.

## Detailed Explanation

**Trigger components**:
- **Event**: INSERT, UPDATE, DELETE (sometimes TRUNCATE, DDL)
- **Timing**: BEFORE, AFTER, INSTEAD OF (for views)
- **Granularity**: FOR EACH ROW (per-row) or FOR EACH STATEMENT
- **Action**: SQL or procedural code to execute

**Example** (PostgreSQL — auto-update timestamp):
\`\`\`sql
CREATE OR REPLACE FUNCTION update_modified_time()
RETURNS TRIGGER AS $$
BEGIN
  NEW.modified_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_modified
BEFORE UPDATE ON users
FOR EACH ROW
EXECUTE FUNCTION update_modified_time();
\`\`\`

Now every UPDATE on users automatically sets modified_at. The application doesn't need to remember.

**Common trigger types**:

**1. BEFORE triggers**:
- Run before the operation
- Can modify the row being inserted/updated (NEW)
- Can cancel the operation (raise exception)
- Use cases: validation, default values, normalization

**2. AFTER triggers**:
- Run after the operation succeeds
- Cannot modify the affected row (already written)
- Use cases: auditing, cascading updates to other tables, sending notifications

**3. INSTEAD OF triggers**:
- For views — replace the operation
- Use cases: making views updatable

**4. Per-row vs per-statement**:
- **Per-row**: Fires once per affected row (more granular, more overhead)
- **Per-statement**: Fires once per statement regardless of rows
- Per-row more common; per-statement for batch logging

**Common use cases**:

**1. Audit trails**:
\`\`\`sql
CREATE TRIGGER audit_user_changes
AFTER UPDATE ON users
FOR EACH ROW
EXECUTE FUNCTION log_user_change();
-- Logs OLD and NEW row to audit_log table
\`\`\`

**2. Maintaining derived data**:
- Maintain order_total when order_items change
- Update product.review_count when reviews added/removed

**3. Enforcing complex business rules**:
- Rules that constraints can't express
- Cross-table validation

**4. Cascading operations**:
- Update related tables when one changes
- (FK CASCADE handles simpler cases)

**5. Auto-populating fields**:
- created_at, updated_at timestamps
- Auto-generated codes/numbers

**Disadvantages and risks**:

**1. Hidden behavior**:
- Operations have invisible side effects
- "Why is this column changing?" — answer is in a trigger somewhere
- Hard to onboard new developers

**2. Performance overhead**:
- Each modified row may fire trigger logic
- Bulk updates become slow
- Cascading triggers can compound

**3. Difficult debugging**:
- Stack traces don't include triggers
- Hard to step through with debugger
- Logs may not show trigger execution

**4. Hard to test**:
- Triggers fire automatically — bypass them in tests is hard
- Can't easily mock

**5. Trigger chains**:
- Trigger fires another trigger fires another...
- Easy to create infinite loops or unintended cascades

**6. Database-coupled logic**:
- Same vendor lock-in as stored procedures
- Migration to different DB requires rewriting

**Modern philosophy**:
- **Use triggers SPARINGLY** — only when other mechanisms fail
- **Prefer application-layer logic** for business rules
- **Use database constraints** for data integrity (CHECK, FK, UNIQUE)
- **Use change streams / CDC** for downstream notifications instead of triggers

**Acceptable trigger uses**:
- Simple, mechanical updates (timestamps, counters)
- Auditing where it must be DB-enforced
- Legacy systems that already rely on them

**Avoid triggers for**:
- Complex business logic
- Cross-system communication (call APIs from triggers — bad idea, slow, fragile)
- Anything stateful or involving external services

## Real-World Example
**Auto-updated timestamps**:
- Trigger sets updated_at on every UPDATE
- Saves boilerplate in every application
- Reasonable trigger use

**Audit logging**:
- Sensitive tables (financial, medical) have AFTER triggers logging all changes
- Required for compliance (SOX, HIPAA)
- Trigger-based audit ensures NO change escapes logging

**Anti-pattern — trigger-based business logic**:
- Order placed → trigger updates inventory → trigger sends email → trigger updates analytics
- Hard to debug, slow, fragile
- Better: orchestrate in application layer

## Interview Tips
- Triggers run automatically on INSERT/UPDATE/DELETE
- BEFORE/AFTER timing matters
- Use sparingly — modern best practice
- Mention "spooky action at a distance" — shows awareness of trade-offs

## Common Follow-up Questions
1. Trigger vs stored procedure? (Trigger fires automatically; procedure called explicitly)
2. Why avoid heavy trigger use? (Hidden behavior, hard to debug, performance)
3. Per-row vs per-statement? (Per-row: each affected row. Per-statement: once per query.)`,

    'Views': `## Definition
A **view** is a virtual table defined by a SQL query. It looks like a table to users — they can SELECT from it — but it's not stored as data; the underlying query runs each time the view is accessed. Views provide abstraction, security, and query simplification.

## Why It Matters
Views encapsulate complex queries, hide schema details, and provide security boundaries. Understanding views — and their performance implications — is important for database design.

## Detailed Explanation

**Basic view**:
\`\`\`sql
CREATE VIEW active_users AS
SELECT id, name, email
FROM users
WHERE status = 'active' AND deleted_at IS NULL;

-- Now query like a table
SELECT * FROM active_users WHERE name LIKE 'A%';
\`\`\`

The view's query expands when used. The SELECT becomes:
\`SELECT id, name, email FROM users WHERE status='active' AND deleted_at IS NULL AND name LIKE 'A%'\`

**Types of views**:

**1. Simple (regular) views**:
- Just a stored query
- No data stored
- Each access re-executes the query
- May be updatable (if the query is simple enough)

**2. Materialized views**:
- Result is computed and STORED
- Faster reads (no recomputation)
- Need refreshing (manual or scheduled)
- Trade fresh data for read speed

**3. Updatable views**:
- Can INSERT/UPDATE/DELETE through them
- Database derives where the change goes
- Restricted: simple views only (no joins, aggregates)

**4. Indexed views (SQL Server) / Materialized views**:
- Materialized + indexed
- Auto-updated as base data changes (sometimes)

**Use cases**:

**1. Query simplification**:
- Encapsulate complex JOINs and conditions
- Application code uses simple SELECT * FROM view

\`\`\`sql
CREATE VIEW order_summary AS
SELECT o.id, c.name AS customer, SUM(oi.qty * p.price) AS total
FROM orders o
JOIN customers c ON o.customer_id = c.id
JOIN order_items oi ON oi.order_id = o.id
JOIN products p ON p.id = oi.product_id
GROUP BY o.id, c.name;
\`\`\`

Now \`SELECT * FROM order_summary WHERE customer = 'Alice'\` is clean.

**2. Security / access control**:
- Grant access to view, not underlying tables
- Hide sensitive columns (e.g., employees view without salary column for non-managers)

\`\`\`sql
CREATE VIEW employees_public AS
SELECT id, name, department FROM employees;  -- excludes salary, ssn

GRANT SELECT ON employees_public TO regular_user;
-- Cannot see salary or ssn
\`\`\`

**3. Backward compatibility**:
- Schema changes — provide view matching old schema
- Apps don't need to change immediately

**4. Aggregation / reporting**:
- Pre-defined report views
- Materialized views for expensive aggregations

**5. Abstraction**:
- Hide complex data model from clients
- Database can refactor without breaking apps using views

**Materialized views**:

**Pros**:
- Fast reads — no query execution per access
- Good for expensive aggregations
- Can be indexed

**Cons**:
- Stale data until refreshed
- Refresh time and resources
- Storage cost

**Refresh strategies**:
- **Manual**: \`REFRESH MATERIALIZED VIEW my_view\`
- **Scheduled**: Cron job refreshes periodically
- **Triggered**: On data changes (complex, often impractical)
- **Incremental**: Only update changed parts (advanced)

**Performance considerations**:

**Regular views**:
- Same performance as the underlying query
- View definition might be slightly slower than ad-hoc query (parser overhead)
- Optimizer often inlines simple views — no penalty

**Materialized views**:
- Read performance: excellent (just reads stored data)
- Write performance: zero — refreshes are separate
- Useful when you can tolerate some staleness

**When NOT to use views**:
- Simple table access (overhead without benefit)
- Frequently changing data with strict freshness requirements (materialized views become stale)
- When understanding schema directly is important

**Common view patterns**:

**1. Reporting views**: Aggregated data for dashboards.
**2. Filtered views**: Show only relevant rows (e.g., customer's own orders).
**3. Joined views**: Pre-joined data for common queries.
**4. Computed views**: Add calculated columns.

## Real-World Example
**Multi-tenant SaaS**: Each tenant should only see their own data.
\`\`\`sql
CREATE VIEW my_orders AS
SELECT * FROM orders WHERE tenant_id = current_setting('app.tenant_id');
\`\`\`
App sets tenant_id per session; queries my_orders are auto-filtered.

**Reporting dashboard**: Daily sales summary as a materialized view, refreshed every hour. Dashboard queries are fast; data is at most an hour stale (acceptable).

**Schema migration**: Old apps query \`SELECT * FROM users\` (had email column). Schema split into users + user_emails. Create view \`users\` reconstructing old shape — old apps work, new apps use new tables.

## Interview Tips
- Distinguish views (query) from materialized views (stored result)
- Views for security and abstraction; materialized views for performance
- Updatable views are limited to simple definitions
- Mention real-world: multi-tenant, reporting, schema evolution

## Common Follow-up Questions
1. View vs materialized view? (View: query stored. Materialized: results stored.)
2. Can you UPDATE through a view? (Yes if simple enough — no joins, no aggregates)
3. When use materialized view? (Expensive queries, tolerable staleness, read-heavy)`,

    'GROUP BY HAVING': `## Definition
**GROUP BY** combines rows with the same values in specified columns into summary rows, often used with aggregate functions (SUM, COUNT, AVG, MIN, MAX). **HAVING** filters those groups based on aggregate conditions, similar to WHERE but applied after grouping.

## Why It Matters
GROUP BY is the foundation of analytical queries. Reports, dashboards, summaries — all rely on grouping and aggregation. Knowing GROUP BY and HAVING separates beginners from intermediate SQL users.

## Detailed Explanation

**Basic GROUP BY**:
\`\`\`sql
SELECT department, COUNT(*) AS employee_count
FROM employees
GROUP BY department;
\`\`\`

Groups all employees by department, counts each group:
\`\`\`
department    | employee_count
Engineering   | 25
Sales         | 12
Marketing     | 8
\`\`\`

**Aggregate functions**:
- **COUNT(*)**: Number of rows in group
- **COUNT(column)**: Non-NULL values in column
- **COUNT(DISTINCT column)**: Distinct non-NULL values
- **SUM(column)**: Total
- **AVG(column)**: Average
- **MIN(column) / MAX(column)**: Smallest / largest
- **STRING_AGG / GROUP_CONCAT**: Concatenate strings (DB-specific)

**Multiple GROUP BY columns**:
\`\`\`sql
SELECT department, year, SUM(salary)
FROM employees
GROUP BY department, year;
\`\`\`

Groups by combinations of department AND year.

**HAVING — filter groups**:
\`\`\`sql
SELECT department, COUNT(*) AS cnt
FROM employees
GROUP BY department
HAVING COUNT(*) > 10;
\`\`\`

Returns only departments with more than 10 employees.

**WHERE vs HAVING**:
- **WHERE**: Filters rows BEFORE grouping
- **HAVING**: Filters groups AFTER aggregation

\`\`\`sql
-- Total salary per department, only for employees hired after 2020,
-- only departments where total salary > 1M
SELECT department, SUM(salary) AS total
FROM employees
WHERE hire_date > '2020-01-01'   -- filters individual employees first
GROUP BY department
HAVING SUM(salary) > 1000000;     -- filters groups after summing
\`\`\`

Order of operations: FROM → WHERE → GROUP BY → HAVING → SELECT → ORDER BY

**Important rules**:

**1. SELECT can only contain**:
- Columns in GROUP BY
- Aggregate functions
- Constants
- Functions of grouped columns

**Wrong**:
\`\`\`sql
SELECT department, name, COUNT(*) FROM employees GROUP BY department;
-- ERROR: name is not in GROUP BY and not aggregated
\`\`\`

**Right**:
\`\`\`sql
SELECT department, COUNT(*) FROM employees GROUP BY department;
\`\`\`

**2. NULL handling**:
- NULLs grouped together (one NULL "group")
- COUNT(*) counts all rows; COUNT(column) skips NULLs
- AVG ignores NULLs (might surprise you)

**3. ORDER BY can use aggregates**:
\`\`\`sql
SELECT department, COUNT(*) AS cnt
FROM employees
GROUP BY department
ORDER BY cnt DESC;
\`\`\`

**Advanced grouping**:

**1. ROLLUP** — hierarchical totals:
\`\`\`sql
SELECT region, country, SUM(sales)
FROM sales
GROUP BY ROLLUP(region, country);
\`\`\`
Returns: per (region, country), per region totals, grand total.

**2. CUBE** — all combinations:
\`\`\`sql
SELECT region, year, SUM(sales)
FROM sales
GROUP BY CUBE(region, year);
\`\`\`
All possible groupings: per region/year, per region, per year, total.

**3. GROUPING SETS**:
\`\`\`sql
SELECT region, country, SUM(sales)
FROM sales
GROUP BY GROUPING SETS ((region), (country), ());
\`\`\`
Multiple groupings in one query.

**4. PARTITION BY (window functions)**:
- Different from GROUP BY — keeps individual rows but adds aggregate columns
\`\`\`sql
SELECT name, department, salary,
       AVG(salary) OVER (PARTITION BY department) AS dept_avg
FROM employees;
\`\`\`
Each row sees its department's average. No grouping — all rows returned.

**Performance**:
- GROUP BY may use indexes (especially when grouping on indexed columns)
- May require sorting or hashing (database picks)
- Aggregates over millions of rows can be slow — consider materialized views

**Common patterns**:

**Top-N per group**: Combine GROUP BY with subqueries or window functions
\`\`\`sql
-- Top earner per department
SELECT * FROM (
  SELECT *, ROW_NUMBER() OVER (PARTITION BY department ORDER BY salary DESC) AS rn
  FROM employees
) t WHERE rn = 1;
\`\`\`

**Running totals**: Window function with ROWS BETWEEN
\`\`\`sql
SELECT date, sales, SUM(sales) OVER (ORDER BY date) AS running_total FROM sales;
\`\`\`

## Real-World Example
**Sales dashboard**: Total revenue per product per month
\`\`\`sql
SELECT product_id, DATE_TRUNC('month', order_date) AS month,
       SUM(quantity * price) AS revenue
FROM orders
JOIN order_items ON orders.id = order_items.order_id
GROUP BY product_id, month
HAVING SUM(quantity * price) > 1000
ORDER BY revenue DESC;
\`\`\`

**Detect duplicate emails**:
\`\`\`sql
SELECT email, COUNT(*) FROM users GROUP BY email HAVING COUNT(*) > 1;
\`\`\`

**Customer lifetime value**:
\`\`\`sql
SELECT customer_id, SUM(amount) AS total_spent, COUNT(*) AS order_count
FROM orders
GROUP BY customer_id
HAVING SUM(amount) > 5000
ORDER BY total_spent DESC;
\`\`\`

## Interview Tips
- WHERE before GROUP BY; HAVING after
- SELECT must only have grouped columns or aggregates (or you get an error)
- Mention window functions as alternative when you need detail rows + aggregates

## Common Follow-up Questions
1. WHERE vs HAVING? (WHERE filters rows; HAVING filters groups)
2. GROUP BY vs PARTITION BY? (GROUP BY collapses; PARTITION BY keeps rows)
3. Why must SELECT match GROUP BY? (Each output row represents a group; non-grouped columns are ambiguous)`,

    'Database Optimization': `## Definition
**Database optimization** is the process of tuning database design, queries, and configurations to improve performance — reducing query time, increasing throughput, and minimizing resource usage. It spans schema design, indexing, query writing, hardware, and configuration.

## Why It Matters
Database performance is often the bottleneck in applications. The difference between a well-optimized and poorly-optimized database can be 100x or more in query time. Knowing optimization techniques is essential for any backend engineer.

## Detailed Explanation

**Optimization layers** (from most impactful to least):

**1. Schema design**:
- Proper normalization (or strategic denormalization)
- Right data types (smallest sufficient — INT vs BIGINT)
- Partitioning large tables
- Foreign keys and constraints

**2. Indexing**:
- Indexes on filter, join, and sort columns
- Composite indexes matching query patterns
- Covering indexes (include all needed columns — avoid table lookup)
- Avoid over-indexing

**3. Query optimization**:
- Use EXPLAIN/EXPLAIN ANALYZE to inspect plans
- Avoid SELECT * (fetch only needed columns)
- Use appropriate JOINs
- Push filters into subqueries
- Avoid N+1 queries (fetch related data in batch)

**4. Caching**:
- Application-level: Redis/Memcached for hot data
- Database-level: query cache, result cache
- HTTP-level: CDN for read-heavy responses

**5. Connection pooling**:
- Reuse connections (creating connections is expensive)
- pgBouncer (PostgreSQL), HikariCP (Java)

**6. Database configuration**:
- Memory settings (shared_buffers, work_mem in PostgreSQL)
- Connection limits
- Vacuum/autovacuum settings (PostgreSQL)
- Query planner configurations

**7. Hardware**:
- More RAM = bigger working set in memory = faster
- SSD vs HDD (10x improvement)
- Faster network for distributed setups

**8. Architecture**:
- Read replicas for read scaling
- Sharding for write scaling
- Caching layers

**Common query optimization techniques**:

**1. Use EXPLAIN**:
\`\`\`sql
EXPLAIN ANALYZE
SELECT * FROM orders WHERE customer_id = 5;
\`\`\`
Shows the execution plan — index scan vs seq scan, cost estimates.

**2. Add appropriate indexes**:
- "Slow query? First check indexes."
- WHERE columns, JOIN columns, ORDER BY columns

**3. Avoid SELECT \\***:
- Fetch only needed columns
- Smaller result set, less I/O
- Enables covering indexes

**4. Avoid N+1 queries**:
\`\`\`
-- BAD: 1 + N queries
users = SELECT * FROM users;
for user in users:
  orders = SELECT * FROM orders WHERE user_id = user.id;

-- GOOD: 2 queries
users = SELECT * FROM users;
orders = SELECT * FROM orders WHERE user_id IN (...);
-- group orders by user_id in code

-- BEST: 1 query with JOIN
SELECT * FROM users LEFT JOIN orders ON ...;
\`\`\`

**5. LIMIT / pagination**:
- Don't fetch 1M rows when you need 50
- Use LIMIT, OFFSET (or keyset pagination for large offsets)

**6. Batch operations**:
\`\`\`sql
-- BAD: N inserts
for row in rows: INSERT INTO ...

-- GOOD: 1 bulk insert
INSERT INTO ... VALUES (...), (...), (...);
\`\`\`

**7. Optimize JOINs**:
- Index join columns
- Filter early (WHERE before JOIN reduces rows)
- Choose JOIN type carefully

**8. Use window functions instead of self-joins** when applicable — often faster.

**9. Materialized views for expensive aggregations**:
- Refresh periodically
- Reads are O(1)

**10. Partitioning large tables**:
- Split by date, region, etc.
- Queries on one partition skip others
- Each partition is smaller — faster

**Common slow query causes**:

**1. Missing index**: Full table scan on large tables.

**2. Wrong index**: Index exists but not used (function in WHERE, type mismatch, etc.).

**3. Bad query plan**: Optimizer chose wrong plan (statistics outdated). Run \`ANALYZE\`.

**4. Lock contention**: Many transactions waiting for locks. Reduce critical section time.

**5. Cartesian product**: Forgotten join condition.

**6. Implicit type conversion**:
\`\`\`sql
WHERE id = '123'    -- if id is integer, may not use index
WHERE id = 123      -- correct, uses index
\`\`\`

**7. Functions in WHERE**:
\`\`\`sql
WHERE LOWER(email) = 'a@b.com'   -- can't use index on email
WHERE email = 'a@b.com'          -- uses index
\`\`\`
Solution: function-based index.

**8. SARGable vs non-SARGable** (Search-ARGument-able):
- Conditions database can use indexes for
- \`WHERE col = X\` is SARGable
- \`WHERE FUNCTION(col) = X\` is not

**Profiling tools**:
- **EXPLAIN**: Query plan
- **Slow query log**: Captures queries above threshold
- **pg_stat_statements** (PostgreSQL): Aggregated query statistics
- **Performance Schema** (MySQL): Detailed metrics
- **Datadog, New Relic, etc.**: APM with database insights

**General optimization process**:
1. Identify slow queries (slow log, monitoring)
2. EXPLAIN to understand the plan
3. Add/fix indexes
4. Rewrite query if needed
5. Repeat — measure each change

## Real-World Example
**Slow login query**: \`SELECT * FROM users WHERE LOWER(email) = ?\` taking 2 seconds.
- Issue: \`LOWER(email)\` prevents index use
- Fix: Add functional index \`CREATE INDEX ON users(LOWER(email))\` — or store email in lowercase

**Slow report**: Daily sales report taking 30 seconds.
- Issue: Complex query aggregating millions of rows
- Fix: Materialized view refreshed daily at 1 AM. Report query: 10 ms.

**Database slow under load**: 100 connections, queries timing out.
- Issue: Each request opens new connection (slow)
- Fix: Connection pooling. 10 pooled connections handle thousands of requests/sec.

## Interview Tips
- Optimization is iterative — measure, fix, measure
- Indexes are the #1 tool — but not the only one
- N+1 queries are extremely common — know them
- EXPLAIN is your friend

## Common Follow-up Questions
1. How identify slow queries? (Slow log, EXPLAIN, monitoring tools)
2. What's an N+1 query? (Loop firing one query per iteration when one batch query suffices)
3. How decide what to index? (WHERE/JOIN/ORDER BY columns; balance read speed vs write cost)`,

    'Database Backup': `## Definition
**Database backup** is the process of creating copies of database data and metadata so they can be restored in case of failure, corruption, or disaster. Backup strategies vary in completeness, frequency, and recovery time, balancing storage cost and data safety.

## Why It Matters
Data loss can destroy a business. A solid backup strategy is non-negotiable for any production database. Understanding backup types, schedules, and recovery procedures is critical for DevOps and DBAs.

## Detailed Explanation

**Why backup**:
- **Hardware failure**: Disk crash, server fire
- **Human error**: Accidental DROP TABLE, bad UPDATE
- **Software bugs**: App corrupts data
- **Malicious actors**: Ransomware, deletion attacks
- **Compliance**: Regulations require certain retention

**Types of backups**:

**1. Full backup**:
- Complete snapshot of entire database
- Largest size; longest to take
- Simplest to restore
- Typical: weekly or daily

**2. Incremental backup**:
- Only changes since the last backup (full or incremental)
- Smaller, faster to take
- Restore needs full + chain of incrementals
- Typical: daily or hourly

**3. Differential backup**:
- Changes since the last FULL backup
- Larger than incremental, smaller than full
- Restore needs full + last differential (simpler than incremental)
- Typical: daily

**4. Logical vs physical**:
- **Logical** (mysqldump, pg_dump): SQL statements to recreate. Portable across versions.
- **Physical** (file-level): Copy of data files. Faster, version-locked.

**5. Continuous backup / WAL archiving**:
- Stream the write-ahead log (WAL/binlog) continuously
- Combined with periodic full backups
- Enables Point-in-Time Recovery (PITR)
- Recover to any specific moment

**Backup strategies**:

**1. Grandfather-Father-Son**:
- Daily, weekly, monthly backups
- Daily kept for a week; weekly for a month; monthly for a year
- Balances retention with storage

**2. 3-2-1 rule**:
- 3 copies of data
- 2 different media types
- 1 off-site copy
- Industry standard for disaster recovery

**Recovery metrics**:

**RPO (Recovery Point Objective)**:
- Maximum acceptable data loss (in time)
- Daily backup → up to 24 hours of data could be lost
- Continuous backup → near-zero RPO

**RTO (Recovery Time Objective)**:
- Maximum acceptable downtime
- How fast can you restore?
- Affected by backup size, restore process, hardware

**Common pairings**:
- Critical financial data: RPO < 1 min, RTO < 15 min
- Standard business: RPO ~1 hour, RTO ~4 hours
- Non-critical: RPO ~24 hours, RTO ~1 day

**Backup tools by database**:

**PostgreSQL**:
- \`pg_dump\` — logical
- \`pg_basebackup\` — physical/streaming
- WAL archiving for PITR
- Continuous archiving with tools like Barman, pgBackRest

**MySQL**:
- \`mysqldump\` — logical
- Percona XtraBackup — physical, hot backup
- Binary log replication for PITR

**MongoDB**:
- \`mongodump\` — logical
- Filesystem snapshots — physical
- Oplog tailing for continuous

**Cloud-managed databases**:
- AWS RDS: Automated backups, snapshots, PITR
- Google Cloud SQL: Similar features
- Often "set and forget" — managed by provider

**Best practices**:

**1. Test restores regularly**:
- "An untested backup is no backup"
- Schedule monthly restore drills
- Verify backup integrity

**2. Off-site / off-account backups**:
- Same datacenter is risky (one disaster = both gone)
- Different cloud account/region
- Air-gapped for ransomware protection

**3. Encryption**:
- Backups contain ALL your data
- Encrypt at rest and in transit
- Manage keys carefully

**4. Monitor backup success**:
- Alert on failed backups
- Track backup size trends (sudden drop = corruption?)

**5. Document recovery procedures**:
- Step-by-step runbook
- Tested procedures
- Available even when systems are down

**6. Backup retention**:
- Daily for X days, weekly for Y weeks, monthly for Z months
- Comply with legal/compliance requirements
- Some industries mandate years of retention

**Disaster recovery vs backup**:
- **Backup**: Data copies for restoration
- **Disaster Recovery (DR)**: Full plan to restore service, including infrastructure
- **High Availability (HA)**: Redundant systems for zero downtime
- All three serve different purposes

**Common pitfalls**:
- **Backups but no testing** — failure on restoration
- **Not checking integrity** — corrupted backup useless
- **Same location backup** — fire/disaster destroys both
- **No encryption** — backup leaks = full data leak
- **Inadequate retention** — can't recover from week-old corruption

## Real-World Example
**Typical SaaS backup strategy**:
- **Continuous WAL archiving**: Every transaction shipped to S3
- **Daily full backup**: 2 AM, retained 30 days
- **Weekly full backup**: Sundays, retained 1 year
- **Cross-region replication**: Backup copied to secondary region
- **Quarterly DR drill**: Restore production to test environment

RPO: ~1 minute (continuous archiving)
RTO: ~30 minutes (automated restore from snapshot)

**Catastrophic example — GitLab 2017**:
- Production DB accidentally deleted
- Multiple backup mechanisms failed (untested!)
- 6 hours of data lost
- Lesson: TEST your backups

## Interview Tips
- Know the backup types (full, incremental, differential)
- RPO and RTO are key concepts
- 3-2-1 rule is industry standard
- "Untested backup is no backup" — emphasize testing

## Common Follow-up Questions
1. RPO vs RTO? (Data loss tolerance vs downtime tolerance)
2. What's PITR? (Point-in-Time Recovery — restore to any moment)
3. Why test backups? (Many backups fail silently; only restore tests prove they work)`,

    'CAP Theorem': `## Definition
The **CAP theorem**, proposed by Eric Brewer in 2000, states that a distributed data system can provide at most TWO of the following three guarantees simultaneously: **Consistency**, **Availability**, and **Partition tolerance**. In practice, network partitions are inevitable, so distributed systems must choose between consistency and availability when partitions occur.

## Why It Matters
CAP is the foundational theorem of distributed databases. It explains why NoSQL exists, why some systems are "AP" and others "CP," and the trade-offs you face when designing distributed data systems.

## Detailed Explanation

**The three guarantees**:

**1. Consistency (C)**:
- All nodes see the same data at the same time
- After a write, all subsequent reads return that write
- Strong consistency = linearizability
- Different from "C" in ACID (which is constraint validity)

**2. Availability (A)**:
- Every request gets a (non-error) response
- No request is rejected due to system state
- Doesn't guarantee LATEST data, just A response

**3. Partition tolerance (P)**:
- System continues operating despite network partitions
- Network failures separate nodes; system still works
- Essentially required in any distributed system (networks fail)

**The choice — when partition occurs**:

When a network partition splits nodes, you must choose:

**Option A (CP — sacrifice Availability)**:
- Refuse to respond if you can't guarantee consistency
- Wait for partition to heal
- Some clients get errors during partition
- Examples: Traditional RDBMS in primary-secondary, MongoDB (default), HBase, Zookeeper, etcd

**Option B (AP — sacrifice Consistency)**:
- Always respond, even if data may be stale or inconsistent
- Different nodes may give different answers
- Resolve inconsistency later (eventual consistency)
- Examples: Cassandra (default), DynamoDB (default), Riak, CouchDB

**You can't really skip P**:
- "CA" systems exist only when there are NO partitions (single node)
- In distributed systems, partitions happen — you must handle them
- So practically, you choose CP or AP

**Common misconception**:
- "Pick 2 of 3" is the popular framing
- More accurate: "When P happens, choose between C and A"
- During normal operation, you can have all three

**PACELC theorem** (Daniel Abadi, 2010) — better framing:
- **If Partition (P): choose Availability (A) or Consistency (C)**
- **Else (no partition): choose Latency (L) or Consistency (C)**

PACELC adds the latency vs consistency trade-off during normal operation.

**Eventual consistency** (the "AP" choice):
- After enough time without writes, all replicas converge
- Different from "no consistency" — just deferred
- Many shapes:
  - **Strong eventual consistency**: Same final state regardless of order
  - **Causal consistency**: Causally related writes seen in order
  - **Read-your-writes**: User sees their own writes immediately

**Tunable consistency** (modern databases):
- Cassandra, DynamoDB let you choose per request
- W (write quorum) + R (read quorum) > N (replicas) → strong consistency
- Lower W + R → faster, eventually consistent

**Examples by system type**:

**CP systems** (consistency over availability):
- **Traditional RDBMS** (when distributed): MySQL/Postgres clusters
- **MongoDB**: Default mode chooses consistency
- **HBase**: Strong consistency, not always available
- **Zookeeper, etcd**: Coordination — must be consistent
- **Spanner** (Google): Strong consistency via TrueTime

**AP systems** (availability over consistency):
- **Cassandra**: Eventually consistent, always responsive
- **DynamoDB**: Default eventually consistent
- **Riak, CouchDB**: Eventual consistency

**When to choose CP**:
- Banking, financial transactions
- Inventory (don't oversell)
- Coordination services
- Anywhere stale data could cause real harm

**When to choose AP**:
- Social media (likes, comments — slight delay OK)
- IoT data ingestion (always accept data; reconcile later)
- Caches and CDNs
- Anywhere uptime > strict accuracy

**The reality**:
- Most production systems are MOSTLY consistent and MOSTLY available
- Trade-offs are gradient, not binary
- Modern databases offer tunable trade-offs
- True 100% consistency or 100% availability is rare

**Beyond CAP**:
- **Spanner / CockroachDB**: Use atomic clocks / hybrid logical clocks for strong consistency at scale
- **Bayou, CRDTs**: New consistency models for collaborative apps
- The field evolves — CAP is foundational but not the final word

## Real-World Example
**Banking — CP**: When a network partition occurs between datacenters, the bank stops accepting transfers rather than risk inconsistency. Brief downtime is preferable to lost or duplicate money.

**Twitter timeline — AP**: If you can't reach all servers, show what you can reach. Slightly out-of-date timeline is fine; "no service" is unacceptable. Eventually all nodes catch up.

**Shopping cart**: Often AP. Add to cart even if some servers are unreachable. Resolve conflicts at checkout (and accept that occasionally, that "in stock" item isn't really).

**Distributed lock service (etcd, Zookeeper)**: Always CP. A lock service that gives wrong answers is worse than no lock service.

## Interview Tips
- "Pick 2 of 3" is the popular framing, but real answer is "during partition, pick C or A"
- Examples: SQL is CP; Cassandra is AP
- PACELC adds latency dimension — modern thinking
- Eventual consistency is not "no consistency"

## Common Follow-up Questions
1. Can you have CA without P? (Only single-node systems — partitions always possible in distributed systems)
2. Difference between CAP-C and ACID-C? (CAP: replicas agree. ACID: constraints satisfied.)
3. What's eventual consistency? (Replicas converge after some time without writes)`,

    'Database Concurrency Control': `## Definition
**Concurrency control** is the set of techniques a database uses to manage simultaneous access to data by multiple transactions while maintaining consistency. Without it, concurrent transactions can produce lost updates, dirty reads, and other anomalies.

## Why It Matters
Every multi-user database faces concurrency issues. Understanding control mechanisms — locking, MVCC, optimistic concurrency — is essential for designing high-performance database applications.

## Detailed Explanation

**Concurrency problems**:

**1. Lost Update**: Two transactions read same value, both compute new value, both write — last write wins, first update lost.

**2. Dirty Read**: Transaction reads data written by another uncommitted transaction; if that transaction rolls back, the read was invalid.

**3. Non-Repeatable Read**: Transaction reads same row twice, gets different values because another transaction modified it in between.

**4. Phantom Read**: Transaction runs same query twice, gets different rows because another transaction inserted/deleted matching rows.

**Control mechanisms**:

**1. Pessimistic locking (Two-Phase Locking, 2PL)**:
- Acquire all needed locks before releasing any
- Two phases: growing (acquiring) and shrinking (releasing)
- Strict 2PL: hold locks until commit/rollback
- Prevents most anomalies but causes blocking and deadlocks

**Lock types**:
- **Shared (S)**: Multiple readers OK
- **Exclusive (X)**: Single writer
- **Intent locks** (IS, IX, SIX): For multi-granularity locking (table + row)

**2. Optimistic Concurrency Control (OCC)**:
- Don't lock; assume conflicts are rare
- Read freely; before commit, check if data changed
- If changed → abort and retry
- Good for low-contention workloads
- Used in JPA/Hibernate (with @Version), MongoDB

**3. Multi-Version Concurrency Control (MVCC)**:
- Each write creates a new version
- Readers see consistent snapshot (their transaction's start point)
- Readers don't block writers; writers don't block readers
- Used in PostgreSQL, Oracle, MySQL InnoDB, MongoDB

**4. Timestamp Ordering**:
- Each transaction gets a timestamp at start
- Operations ordered by timestamp
- Older transactions get priority

**MVCC details (PostgreSQL)**:
- Each row has \`xmin\` (created by) and \`xmax\` (deleted by) transaction IDs
- Reads filter rows visible at transaction's snapshot
- Old versions cleaned up by VACUUM
- Massive read scalability — readers never wait

**Locking granularity**:
- **Database lock**: Entire DB locked (rare, drastic)
- **Table lock**: Whole table — high contention
- **Page lock**: Disk page (multiple rows)
- **Row lock**: Most common — fine-grained
- **Field lock**: Rare — overhead too high

**Deadlocks in databases**: Two transactions wait for each other's locks. Detection: wait-for graph cycle detection. Resolution: abort one (the "victim") and retry.

## Real-World Example
**Bank transfer**: Transaction A holds lock on Account 1, wants Account 2. Transaction B holds Account 2, wants Account 1. Deadlock. Database detects, aborts one. Application retries.

**E-commerce inventory**: Optimistic concurrency — read stock, check out, on commit verify stock unchanged. If changed, retry. Fast for low contention.

**Reporting on busy database**: PostgreSQL's MVCC lets long reports run without blocking ongoing writes. Reports see consistent snapshot from their start time.

## Interview Tips
- Know 2PL, MVCC, OCC distinction
- MVCC is the modern default — PostgreSQL, Oracle, MongoDB
- Deadlock detection is a classic concurrency topic
- Connect to isolation levels — they're implemented via concurrency control

## Common Follow-up Questions
1. MVCC vs locking? (MVCC: snapshot-based, no read blocking. Locking: transactions wait.)
2. What's 2PL? (Two-phase locking — acquire all, then release all)
3. How are deadlocks detected? (Wait-for graph cycle detection)`,

    'Database Schema Design': `## Definition
**Schema design** is the process of structuring database tables, columns, relationships, and constraints to efficiently model the data of an application. Good schema design balances normalization (data integrity) with denormalization (query performance).

## Why It Matters
A poorly designed schema can cripple an otherwise well-built application — slow queries, data inconsistencies, painful migrations. Schema design is a foundational skill for backend developers.

## Detailed Explanation

**Steps in schema design**:

**1. Understand the requirements**:
- What entities exist? (Users, Orders, Products...)
- How do they relate? (One-to-many, many-to-many)
- What queries will be run? (Reads vs writes, analytics)
- What's the scale? (Hundreds of rows? Billions?)

**2. Identify entities and attributes**:
- Each entity becomes a table
- Each attribute becomes a column
- Decide types: INT, VARCHAR, TIMESTAMP, etc.

**3. Define relationships**:
- **One-to-One**: Foreign key + UNIQUE constraint (rare; usually merge tables)
- **One-to-Many**: Foreign key on the "many" side
- **Many-to-Many**: Junction/link table with two foreign keys

**4. Normalize**:
- Apply 1NF, 2NF, 3NF (sometimes BCNF)
- Eliminate redundancy
- Ensure each fact stored once

**5. Add constraints**:
- PRIMARY KEY
- UNIQUE
- NOT NULL
- CHECK (value > 0)
- FOREIGN KEY with ON DELETE/UPDATE rules

**6. Add indexes**:
- On frequently queried columns
- On foreign keys
- Composite indexes for multi-column WHERE/ORDER BY

**7. Plan for growth**:
- Will this scale? Sharding strategy?
- Time-series data — partition by date?
- Soft deletes vs hard deletes?

**Common patterns**:

**1. Audit columns**:
\`\`\`sql
created_at TIMESTAMP DEFAULT NOW(),
updated_at TIMESTAMP DEFAULT NOW(),
created_by INT REFERENCES users(id),
deleted_at TIMESTAMP NULL  -- soft delete
\`\`\`

**2. Polymorphic associations** (controversial):
- One column references different tables based on type
- Lose foreign key integrity
- Better: separate tables per type

**3. EAV (Entity-Attribute-Value)** (anti-pattern usually):
- Generic table with key/value pairs
- Flexible but kills performance and integrity
- Use JSONB columns instead in PostgreSQL

**4. Star schema** (data warehouse):
- Central fact table + dimension tables
- Optimized for analytics
- Heavy denormalization for query speed

**5. Snowflake schema**:
- Like star but normalized dimensions
- More joins, more storage efficiency

**Normalization vs Denormalization trade-offs**:

**Normalize for**:
- OLTP (transactional systems)
- Frequent writes
- Data integrity critical
- Storage cost matters

**Denormalize for**:
- OLAP (analytics)
- Read-heavy workloads
- Performance > storage
- Pre-computed aggregations

**Common mistakes**:
- Storing comma-separated values in one column (violates 1NF — query nightmare)
- Generic columns ("data" varchar) without structure
- Missing foreign keys (orphaned data)
- No indexes on JOIN columns (slow queries)
- Premature denormalization (optimize after measuring)

## Real-World Example
**E-commerce schema**:
\`\`\`sql
users(id, email, password_hash, created_at)
products(id, name, price, stock, category_id)
categories(id, name, parent_id)
orders(id, user_id, total, status, created_at)
order_items(id, order_id, product_id, quantity, unit_price)
\`\`\`
Note \`unit_price\` in order_items captures price AT TIME of order — products.price might change later.

**Many-to-many — User roles**:
\`\`\`sql
users(id, name)
roles(id, name)
user_roles(user_id, role_id, assigned_at, assigned_by)
\`\`\`
Junction table can carry extra data (when assigned, by whom).

## Interview Tips
- Walk through the design process — entities, relationships, constraints, indexes
- Know normal forms but also when to denormalize
- "It depends on access patterns" is often the right answer
- Mention common patterns: audit columns, soft deletes, junction tables

## Common Follow-up Questions
1. When to denormalize? (Read-heavy workloads where joins are expensive)
2. How to handle hierarchies (categories with parents)? (Adjacency list, nested set, materialized path)
3. Soft delete vs hard delete? (Soft: keep row with deleted flag. Hard: actually remove. Soft easier for audit/recovery.)`,

    'Hash vs B-Tree Index': `## Definition
**Hash indexes** use a hash table — they map a key to a location via a hash function, providing O(1) lookups for equality but no range support. **B-Tree indexes** use a balanced tree — they provide O(log n) lookups and efficiently support range queries, ordering, and prefix matching.

## Why It Matters
Choosing the right index type affects query performance dramatically. B-trees are the default for most databases, but hash indexes shine in specific cases.

## Detailed Explanation

**Hash index**:
- Stores key → row pointer in hash table
- Lookup: hash(key) → bucket → row
- Equality: O(1) average
- Range: NOT supported (hashing destroys ordering)
- ORDER BY: NOT supported
- Prefix match (LIKE 'ab%'): NOT supported

**B-Tree index**:
- Self-balancing tree, sorted keys
- Each node has many children (high fan-out)
- Lookup: O(log n) — typically 3-4 levels for billions of rows
- Equality: efficient
- Range queries: YES (traverse leaf nodes)
- ORDER BY: YES (already sorted)
- Prefix match: YES (LIKE 'abc%')

**Comparison**:

| Aspect | Hash | B-Tree |
|--------|------|--------|
| Equality lookup | O(1) | O(log n) |
| Range queries | No | Yes |
| ORDER BY | No | Yes |
| Prefix LIKE | No | Yes |
| Storage | Compact | Slightly more |
| Index size growth | Linear | Logarithmic depth |
| Concurrent inserts | Hash collisions | Tree splits |
| Disk-friendliness | Random I/O | Sequential leaves |

**When to use Hash indexes**:
- Equality-only lookups (= or IN)
- High-cardinality columns
- In-memory databases (Redis, MEMSTORE engines)
- Specific cases like PostgreSQL's hash indexes (use rare)

**When to use B-Tree indexes**:
- Almost everything else (default!)
- Range queries (BETWEEN, <, >)
- Sorting (ORDER BY)
- Prefix searches
- Composite indexes

**Database-specific notes**:

**MySQL InnoDB**: Default B-Tree. Hash indexes only for MEMORY engine. Adaptive Hash Index automatic for hot lookups.

**PostgreSQL**: B-Tree default. Hash indexes exist but historically not crash-safe (fixed in v10). Rarely used.

**MongoDB**: B-Tree (or B-Tree variants) for indexes. Hashed indexes for sharding only.

**Redis**: All in-memory hash structures. O(1) lookups dominate.

**Adaptive Hash Index (InnoDB)**: Automatically creates in-memory hash for frequently accessed B-Tree pages — best of both worlds without configuration.

## Real-World Example
**User lookup by ID** (equality): Both work, hash slightly faster but B-Tree's O(log n) over a billion rows is ~30 — barely measurable.

**Date range query** \`WHERE created_at BETWEEN '2024-01-01' AND '2024-12-31'\`: B-Tree only. Hash would require scanning every key.

**Sorted result** \`ORDER BY name\`: B-Tree only — already sorted in tree order.

**Geographic data**: Specialized indexes (R-Tree, GiST, geohash) — neither pure hash nor B-Tree.

## Interview Tips
- Default answer: B-Tree (covers most cases)
- Hash indexes for pure equality, in-memory caches
- Mention range/sort support difference clearly
- B-Tree's logarithmic depth keeps disk I/O minimal

## Common Follow-up Questions
1. Why are B-Trees better for disk? (Few levels = few disk reads to traverse)
2. Why doesn't hash support range? (Hash function destroys order)
3. What about LSM trees? (Write-optimized; used in Cassandra, RocksDB — different trade-offs)`,

    'Query Execution Plan': `## Definition
A **query execution plan** (or "query plan" / "explain plan") is the database's strategy for executing a SQL query — which indexes to use, what join algorithms, the order of operations. Examining and optimizing query plans is the core of database performance tuning.

## Why It Matters
Slow queries are the most common database performance issue. Reading execution plans is THE skill for diagnosing them. Senior engineers fluent in plans can dramatically improve application performance.

## Detailed Explanation

**Getting the plan**:
- **PostgreSQL/MySQL**: \`EXPLAIN <query>\` — shows the plan
- **EXPLAIN ANALYZE**: Actually runs the query and reports actual times (PostgreSQL)
- **MySQL**: \`EXPLAIN ANALYZE\` (8.0+) or \`SHOW PROFILE\`
- **SQL Server**: \`SET SHOWPLAN_ALL ON\` or graphical plan in SSMS

**What's in a plan**:
- **Operations**: Sequential Scan, Index Scan, Index Only Scan, Nested Loop, Hash Join, Merge Join, Sort, Aggregate
- **Estimated rows / actual rows**
- **Cost** (arbitrary units)
- **Time** (with EXPLAIN ANALYZE)
- **Buffers / I/O statistics**

**Common operations**:

**Scan types**:
- **Sequential Scan** (full table scan): Reads entire table. Fine for small tables; bad for large ones with selective WHERE.
- **Index Scan**: Uses index to find rows, then reads from table.
- **Index Only Scan**: Index has all needed columns; doesn't touch the table. Fastest.
- **Bitmap Index Scan**: Combines multiple indexes via bitmaps; good for OR conditions.

**Join algorithms**:
- **Nested Loop**: For each row in A, look up in B. Good for small A or indexed B.
- **Hash Join**: Build hash table from one side; probe with other. Good for large unindexed equality joins.
- **Merge Join**: Both sides sorted; merge them. Good when both already sorted.

**Other operations**:
- **Sort**: ORDER BY without supporting index
- **Aggregate**: GROUP BY processing
- **Hash Aggregate**: Aggregation via hash table
- **Limit**: Stops early once N rows reached

**Reading a plan**:
\`\`\`
QUERY: SELECT * FROM orders WHERE user_id = 5;

PostgreSQL plan:
Index Scan using orders_user_id_idx on orders
  Index Cond: (user_id = 5)
  Estimated rows: 12, Actual rows: 14
  Cost: 4.5..28.7
\`\`\`
- Used the index on user_id (good)
- Estimated 12 rows, actual 14 (close — stats up to date)
- Low cost — fast query

**Bad plan example**:
\`\`\`
Seq Scan on orders
  Filter: (user_id = 5)
  Estimated rows: 12, Actual rows: 14
  Rows Removed by Filter: 999986
\`\`\`
- Scanned entire 1M-row table to find 14 — index missing or not used
- Fix: ensure index exists, ANALYZE for stats

**Common performance issues**:

**1. Full table scan when index expected**:
- Function on indexed column: \`WHERE LOWER(email) = ...\` (use functional index)
- Implicit type cast: comparing string to int
- OR conditions across columns

**2. Wrong join order**:
- Optimizer picks bad order due to outdated statistics
- Solution: \`ANALYZE table\` to update stats

**3. Sort spilling to disk**:
- ORDER BY without index needs in-memory sort
- Large result sets exhaust work_mem → spill to temp files
- Add covering index, or increase work_mem

**4. Nested loop with no index**:
- O(N×M) catastrophe
- Add index on join column

**Optimization techniques**:

**1. Add appropriate indexes**:
- Single column for simple WHERE
- Composite for multi-column WHERE/ORDER BY
- Covering indexes (include all needed columns)

**2. Rewrite queries**:
- Replace OR with UNION
- Replace correlated subqueries with JOINs
- Avoid SELECT * — list only needed columns

**3. Update statistics**:
- \`ANALYZE table\` (PostgreSQL)
- \`ANALYZE TABLE table\` (MySQL)

**4. Tune database parameters**:
- work_mem, effective_cache_size (PostgreSQL)
- innodb_buffer_pool_size (MySQL)

## Real-World Example
**Slow query investigation**: Order page takes 30 seconds. EXPLAIN reveals Sequential Scan on orders + Sort. Add index on \`(user_id, created_at)\` → Index Scan + sorted output → 50ms.

**Stale statistics**: Query suddenly slow after big data load. Plan shows wildly wrong row estimates. \`ANALYZE\` to refresh stats — query back to fast.

**Hidden cost**: \`SELECT * FROM big_table\` returns 100 columns when 3 needed. Fix to \`SELECT id, name, email\` — covering index can serve query without table fetch.

## Interview Tips
- Know how to read plans for both PostgreSQL and MySQL
- Sequential scan on large table = red flag
- Mention EXPLAIN ANALYZE for actual times
- "Add an index" is often the answer but not always

## Common Follow-up Questions
1. EXPLAIN vs EXPLAIN ANALYZE? (First: estimates. Second: actually runs and reports actuals.)
2. Why might index not be used? (Function on column, type cast, low selectivity, optimizer thinks scan is faster)
3. Hash join vs nested loop? (Hash: large unindexed equality. Nested loop: small driver + index on inner.)`,

    'OLTP vs OLAP': `## Definition
**OLTP (Online Transaction Processing)** systems handle real-time transactional workloads — many small, fast read/write operations. **OLAP (Online Analytical Processing)** systems handle analytical workloads — complex queries over large datasets for business intelligence and reporting.

## Why It Matters
OLTP and OLAP have fundamentally different requirements that drive different database choices. Modern data architectures often involve both — e.g., production OLTP database + analytics warehouse for OLAP.

## Detailed Explanation

**OLTP characteristics**:
- **Workload**: Many concurrent users (thousands), small transactions
- **Operations**: Lots of INSERT, UPDATE, DELETE; SELECT by primary key
- **Data**: Current operational data
- **Volume per query**: Small (one or few rows)
- **Schema**: Highly normalized (3NF)
- **Latency**: Milliseconds
- **Examples**: Bank transactions, e-commerce orders, social media posts
- **Databases**: PostgreSQL, MySQL, Oracle, SQL Server (general-purpose)

**OLAP characteristics**:
- **Workload**: Few users (analysts), complex queries
- **Operations**: Mostly SELECT with aggregations (SUM, COUNT, GROUP BY)
- **Data**: Historical, accumulated over years
- **Volume per query**: Large (millions to billions of rows scanned)
- **Schema**: Denormalized — star/snowflake schema
- **Latency**: Seconds to minutes acceptable
- **Examples**: Sales reports, customer behavior analysis, trend forecasting
- **Databases**: Snowflake, BigQuery, Redshift, ClickHouse, Druid

**Comparison table**:

| Aspect | OLTP | OLAP |
|--------|------|------|
| Workload | Transactions | Analysis |
| Users | Many (1000s) | Few (10s) |
| Queries | Simple, frequent | Complex, infrequent |
| Read:Write ratio | ~70:30 | ~99:1 |
| Data freshness | Current | Periodic snapshots |
| Schema | Normalized | Denormalized (star schema) |
| Storage | Row-oriented | Column-oriented |
| Indexes | Many B-trees | Bitmap, columnar |
| Query target | Single rows | Aggregations |
| Example | "Order #1234 status?" | "Total revenue per region by quarter" |

**Row vs Column storage**:

**Row storage** (OLTP):
- Each row stored together: (1, "Alice", 100)(2, "Bob", 200)
- Fast for "give me whole row"
- Bad for "sum all values in one column"

**Column storage** (OLAP):
- Each column stored together: 1,2,3...; "Alice","Bob","Charlie"...; 100,200,300...
- Compresses well (similar values together)
- Fast for column aggregations (skip irrelevant columns)
- Bad for inserting new rows (touches every column file)

**ETL — bridging OLTP and OLAP**:
- **Extract** from OLTP databases
- **Transform** (clean, aggregate, denormalize)
- **Load** into OLAP warehouse
- Run nightly or incrementally
- Data warehouse has stale data (yesterday) but fast queries

**Modern approaches**:

**HTAP (Hybrid Transactional/Analytical Processing)**:
- Both workloads on same database
- Examples: TiDB, MemSQL/SingleStore, Snowflake (catching up)
- Reduces ETL complexity

**Data Lakehouse**:
- Cheap object storage (S3) + columnar formats (Parquet)
- Query engines (Spark, Trino, Athena) on top
- Examples: Databricks, AWS Athena

**Streaming analytics**:
- Real-time analytics on event streams
- Examples: Apache Flink, Kafka Streams, Druid
- Bridges OLTP fresh data with OLAP-style queries

## Real-World Example
**E-commerce architecture**:
- **OLTP**: PostgreSQL stores orders, users, products. Handles checkout in 50ms.
- **ETL**: Nightly job copies data to data warehouse, aggregating into daily summaries.
- **OLAP**: Snowflake holds 5 years of sales data. Analyst runs "Q3 revenue by category" in 10 seconds.

**Banking**:
- **OLTP**: Account balances, transfers, every customer action — Oracle/DB2.
- **OLAP**: Customer behavior, fraud patterns, risk modeling — Teradata, Snowflake.

**Real-time dashboards**: Hybrid: Druid or ClickHouse — analytical queries on relatively fresh data.

## Interview Tips
- Memorize the comparison table
- Row vs column storage is THE technical difference
- OLTP databases for apps; OLAP for analytics
- Know HTAP as the modern hybrid trend

## Common Follow-up Questions
1. Why is column storage better for analytics? (Aggregations only touch relevant columns; better compression)
2. Can one database do both? (HTAP systems try; usually trade-offs in either direction)
3. What's a data lake? (Cheap, schema-flexible storage for raw data; queryable via separate engines)`,

    'Database Locking': `## Definition
**Database locking** is the mechanism databases use to control concurrent access to data, ensuring transactions don't interfere destructively. Locks come in different types (shared, exclusive) and granularities (row, page, table) with different trade-offs between concurrency and overhead.

## Why It Matters
Locking is the most visible mechanism behind transaction isolation. Misunderstanding locking causes deadlocks, blocked queries, and performance issues — common production problems.

## Detailed Explanation

**Lock types**:

**1. Shared (S) lock — read lock**:
- Multiple transactions can hold S locks simultaneously
- Allows concurrent reads
- Blocks exclusive locks

**2. Exclusive (X) lock — write lock**:
- Only one transaction can hold X
- Blocks all other locks (including S)
- Required for modifications

**3. Update (U) lock** (some databases):
- Intermediate between S and X
- "I'm reading but might write" — prevents deadlock when scanning to update

**Compatibility matrix**:

| Held → / Requested ↓ | None | S | X |
|----------------------|------|---|---|
| S (shared) | OK | OK | Wait |
| X (exclusive) | OK | Wait | Wait |

**Lock granularity** (smaller = more concurrency, more overhead):

**1. Database lock**: Whole DB locked. Used for backups, migrations.
**2. Table lock**: Whole table — \`LOCK TABLES\` or implicit during DDL.
**3. Page lock**: Database page (typically 8 KB containing multiple rows).
**4. Row lock**: Single row — most common for OLTP.
**5. Field lock**: Sub-row level — rare, overhead too high.

**Multi-granularity locking** (intent locks):
- IS (Intent Shared), IX (Intent Exclusive), SIX (Shared Intent Exclusive)
- Indicate "I plan to acquire S or X locks at finer granularity"
- Allow efficient locking at multiple levels

**Locking strategies**:

**1. Pessimistic locking**:
- Acquire locks before accessing data
- Hold until commit
- Strong consistency, possible blocking
- Default in many databases

**2. Optimistic locking**:
- No locks during operation
- Check version/timestamp at commit
- If conflict, retry
- Good for low-contention workloads

**3. MVCC (Multi-Version Concurrency Control)**:
- Reads see snapshots — no locks for reads
- Writes create new versions
- Used by PostgreSQL, Oracle, MySQL InnoDB

**Common lock-related queries**:

**Explicit row lock (PostgreSQL/MySQL)**:
\`\`\`sql
-- SELECT FOR UPDATE: acquire X lock on selected rows
SELECT * FROM accounts WHERE id = 1 FOR UPDATE;
-- Other transactions wait until commit/rollback

-- SELECT FOR SHARE / LOCK IN SHARE MODE: acquire S lock
SELECT * FROM products WHERE id = 5 FOR SHARE;
\`\`\`

**Deadlocks** — two transactions waiting for each other:
\`\`\`
T1: lock(A); want B
T2: lock(B); want A
\`\`\`
Database detects via wait-for graph cycle, aborts one (the "victim"). Application should retry on deadlock errors.

**Lock waits and timeouts**:
- Default behavior: wait indefinitely
- \`SET lock_timeout = '5s'\` (PostgreSQL) — fail after 5 seconds
- \`innodb_lock_wait_timeout\` (MySQL)
- Useful to prevent runaway blocking

**Common locking issues**:

**1. Long-running transactions**:
- Hold locks → block other transactions
- Solution: keep transactions short

**2. Lock escalation**:
- Many row locks → upgraded to table lock (SQL Server)
- Reduces overhead but kills concurrency

**3. Hot row contention**:
- Single row updated by many transactions (counter)
- Serializes — bottleneck
- Solutions: sharded counters, atomic increments, optimistic concurrency

**4. Foreign key locks**:
- Inserting child takes shared lock on parent
- Concurrent updates to parent block inserts
- Specific to MySQL InnoDB pre-5.7

## Real-World Example
**Bank transfer**:
\`\`\`sql
BEGIN;
SELECT balance FROM accounts WHERE id = 1 FOR UPDATE;  -- X lock
UPDATE accounts SET balance = balance - 100 WHERE id = 1;
SELECT balance FROM accounts WHERE id = 2 FOR UPDATE;  -- X lock
UPDATE accounts SET balance = balance + 100 WHERE id = 2;
COMMIT;  -- locks released
\`\`\`
Other transfers on these accounts wait. Always lock in consistent order to avoid deadlocks.

**Inventory check**:
\`\`\`sql
BEGIN;
SELECT stock FROM products WHERE id = 10 FOR UPDATE;
-- application checks stock
UPDATE products SET stock = stock - 1 WHERE id = 10;
INSERT INTO orders ...;
COMMIT;
\`\`\`
Without FOR UPDATE, two simultaneous orders could both pass the check.

**Deadlock retry pattern**:
\`\`\`
for (int i = 0; i < 3; i++) {
  try { runTransaction(); break; }
  catch (DeadlockException) { sleep(random); }
}
\`\`\`

## Interview Tips
- Know S vs X lock compatibility
- Granularity affects concurrency (row > page > table)
- MVCC reduces locking dramatically
- Deadlocks are detected and resolved by aborting one transaction

## Common Follow-up Questions
1. Why do databases use row locks? (Better concurrency than table locks)
2. What's MVCC? (Snapshot-based concurrency — readers don't block writers)
3. How are deadlocks resolved? (Wait-for graph cycle detection; abort victim transaction)`,

    'JOIN Algorithms': `## Definition
**JOIN algorithms** are the methods databases use to physically execute SQL JOINs. The three main algorithms are **Nested Loop**, **Hash Join**, and **Merge Join** — each optimal for different scenarios. The query optimizer picks one based on table sizes, indexes, and statistics.

## Why It Matters
Understanding join algorithms explains why some queries are fast and others crawl. It's essential for query optimization and reading execution plans.

## Detailed Explanation

**1. Nested Loop Join**:
- For each row in OUTER table, scan INNER table for matches
- Cost: O(N × M) without indexes, O(N × log M) with index on inner

\`\`\`
For each row R in OuterTable:
  For each row S in InnerTable:
    If R.key == S.key, output (R, S)
\`\`\`

**Best when**:
- One table is small (outer)
- Inner table has index on join column
- Need only first few results (early termination)

**Worst when**: Both tables large with no index — quadratic disaster.

**Variant — Index Nested Loop**: Inner table's index makes per-row lookup O(log M).

**2. Hash Join**:
- Build hash table from smaller table on join key
- Probe with each row from larger table
- Cost: O(N + M) — linear

\`\`\`
Phase 1 (Build): Hash all rows of TableA on key
Phase 2 (Probe): For each row in TableB, hash key, look in hash table
\`\`\`

**Best when**:
- Both tables large
- Equality join (joins like \`a.id = b.id\`)
- No useful index on either table
- Plenty of memory for hash table

**Worst when**:
- Hash table doesn't fit in memory (spills to disk)
- Non-equality join (range, inequality) — hash doesn't help

**3. Merge Join (Sort-Merge Join)**:
- Both tables sorted by join key
- Walk both in parallel, matching as we go
- Cost: O(N + M) if pre-sorted; O(N log N + M log M) if must sort

\`\`\`
Sort A by key (if not already sorted)
Sort B by key (if not already sorted)
Walk both in parallel:
  If A.key == B.key: output match, advance
  If A.key < B.key: advance A
  If A.key > B.key: advance B
\`\`\`

**Best when**:
- Both tables already sorted (existing indexes or previous ORDER BY)
- Both large
- Output also needs sorted order

**Worst when**: Sorting is expensive and not amortized.

**Comparison**:

| Algorithm | Time Complexity | Memory | Best Use Case |
|-----------|-----------------|--------|---------------|
| Nested Loop | O(N×M) | Low | Small + indexed |
| Hash Join | O(N+M) | High (hash table) | Large unindexed equality |
| Merge Join | O(N+M) | Medium | Both pre-sorted |

**Optimizer's choice**:

The query optimizer estimates costs and picks the cheapest. Statistics matter:
- **Row counts** for both tables
- **Index availability**
- **Memory for hash tables**
- **Selectivity of WHERE conditions**

Bad statistics → wrong choice → slow queries. Hence \`ANALYZE\` to keep stats fresh.

**Forcing a specific algorithm** (debugging):
- PostgreSQL: \`enable_nestloop\`, \`enable_hashjoin\`, \`enable_mergejoin\` parameters
- MySQL: Hints like \`STRAIGHT_JOIN\`
- SQL Server: \`OPTION (HASH JOIN)\` or similar
- Use sparingly — usually optimizer knows best

**Outer joins**:
- LEFT/RIGHT/FULL OUTER JOIN supported by all three algorithms
- Hash join needs more bookkeeping (track unmatched rows)

**Anti-joins / Semi-joins**:
- \`WHERE NOT EXISTS\`, \`WHERE EXISTS\`
- Often optimized as semi-/anti-join — special variants
- More efficient than full outer join + filtering

## Real-World Example
**JOIN small to large with index**:
\`\`\`sql
SELECT * FROM users u JOIN orders o ON u.id = o.user_id
WHERE u.email = 'alice@example.com';
\`\`\`
Optimizer picks: filter users (1 row), nested loop with index on orders.user_id. Fast.

**JOIN two large tables**:
\`\`\`sql
SELECT * FROM logs JOIN users ON logs.user_id = users.id;
-- 10M logs JOIN 1M users
\`\`\`
Hash join: build on users (1M rows), probe with logs (10M rows). One pass each. Linear time.

**Pre-sorted data**:
\`\`\`sql
-- Both tables sorted by id (clustered index)
SELECT * FROM orders o JOIN order_items i ON o.id = i.order_id
ORDER BY o.id;
\`\`\`
Merge join is efficient — uses existing sort, output already sorted.

## Interview Tips
- Know all three algorithms and their best cases
- Hash join for "two large tables, equality join"
- Nested loop for "small + indexed inner"
- Merge join for "both pre-sorted"
- Mention the optimizer chooses based on statistics

## Common Follow-up Questions
1. Why isn't hash join always best? (Memory cost, no range support, must materialize hash table)
2. Can you join non-equality with hash? (No — use nested loop or merge with conditions)
3. What's a Cartesian product? (No JOIN condition — N×M rows; usually a bug)`,

    'Database Constraints': `## Definition
**Database constraints** are rules enforced by the database to ensure data integrity. They prevent invalid data from being stored regardless of what the application code does. Common constraints: NOT NULL, UNIQUE, PRIMARY KEY, FOREIGN KEY, CHECK, DEFAULT.

## Why It Matters
Constraints are the database's last line of defense against bad data. Application bugs, manual SQL, and concurrent updates can all bypass app-level validation — but not database constraints. Skipping them invites data corruption.

## Detailed Explanation

**Types of constraints**:

**1. NOT NULL**:
\`\`\`sql
email VARCHAR(255) NOT NULL
\`\`\`
Column must always have a value. Prevents missing critical data.

**2. UNIQUE**:
\`\`\`sql
email VARCHAR(255) UNIQUE
\`\`\`
No two rows can have the same value. Allows multiple NULLs by default (varies by DB).

**3. PRIMARY KEY**:
\`\`\`sql
id SERIAL PRIMARY KEY  -- PostgreSQL
id INT PRIMARY KEY AUTO_INCREMENT  -- MySQL
\`\`\`
Combines NOT NULL + UNIQUE. Identifies each row uniquely. Usually has a clustered index.

**4. FOREIGN KEY**:
\`\`\`sql
user_id INT REFERENCES users(id)
\`\`\`
Value must exist in the referenced table. Maintains relationships between tables.

**Foreign key actions** (on referenced row delete/update):
- **CASCADE**: Delete/update child rows too
- **RESTRICT** / **NO ACTION**: Prevent action if children exist (default)
- **SET NULL**: Set child's FK to NULL
- **SET DEFAULT**: Set child's FK to its default

\`\`\`sql
ON DELETE CASCADE  -- delete children when parent deleted
ON DELETE SET NULL  -- orphan children
\`\`\`

**5. CHECK**:
\`\`\`sql
age INT CHECK (age >= 0 AND age <= 120)
status VARCHAR(20) CHECK (status IN ('active', 'inactive', 'banned'))
\`\`\`
Custom condition. Database evaluates on INSERT/UPDATE.

**6. DEFAULT**:
\`\`\`sql
created_at TIMESTAMP DEFAULT NOW()
status VARCHAR(20) DEFAULT 'active'
\`\`\`
Used if INSERT doesn't specify the column.

**Composite constraints**:
\`\`\`sql
-- Composite PRIMARY KEY (e.g., junction table)
PRIMARY KEY (user_id, role_id)

-- Composite UNIQUE
UNIQUE (department_id, employee_number)

-- Composite FOREIGN KEY
FOREIGN KEY (a, b) REFERENCES other_table(a, b)
\`\`\`

**Naming constraints**:
\`\`\`sql
CONSTRAINT chk_age CHECK (age >= 0)
CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES users(id)
\`\`\`
Named constraints allow easier management (drop, alter).

**Adding/removing constraints**:
\`\`\`sql
ALTER TABLE users ADD CONSTRAINT chk_email CHECK (email LIKE '%@%');
ALTER TABLE orders DROP CONSTRAINT fk_user;
\`\`\`

**Implications and gotchas**:

**1. Performance**:
- Constraints add overhead per insert/update
- FK requires lookup in parent table (typically indexed)
- Worth the small cost for integrity

**2. Bulk loading**:
- Disable constraints during bulk import for speed
- Re-enable and validate at the end
- \`SET CONSTRAINTS ALL DEFERRED\` (PostgreSQL)

**3. NULL behavior**:
- NULL = NULL is UNKNOWN, not TRUE
- UNIQUE allows multiple NULLs (in most DBs — Oracle differs)
- NOT NULL prevents this ambiguity

**4. Cascading effects**:
- ON DELETE CASCADE can wipe out far more than expected
- Verify you actually want this — chains can be deep

**5. Performance trap**:
- FK without index on FK column → slow CASCADE deletes
- Always index FK columns

**Constraint vs application validation**:
- Application: friendly errors, complex logic, expensive checks
- Database: ultimate enforcement, simple rules, always applies
- Use BOTH — defense in depth

**When to use which**:
- Email format → app (regex too complex for CHECK)
- Email uniqueness → DB (UNIQUE)
- Age range → both (UI prevents weird inputs; CHECK enforces)
- Foreign keys → ALWAYS database
- Required fields → both (NOT NULL + form validation)

## Real-World Example
**E-commerce schema with constraints**:
\`\`\`sql
CREATE TABLE products (
  id SERIAL PRIMARY KEY,
  sku VARCHAR(50) UNIQUE NOT NULL,
  name VARCHAR(200) NOT NULL,
  price DECIMAL(10,2) NOT NULL CHECK (price >= 0),
  stock INT NOT NULL DEFAULT 0 CHECK (stock >= 0),
  category_id INT NOT NULL REFERENCES categories(id),
  created_at TIMESTAMP DEFAULT NOW()
);
\`\`\`
- Can't insert duplicate SKU
- Negative prices/stock blocked
- Category must exist
- Created_at auto-set

**Cascading delete**:
\`\`\`sql
CREATE TABLE order_items (
  order_id INT REFERENCES orders(id) ON DELETE CASCADE,
  ...
);
\`\`\`
Delete an order → all order items deleted automatically. Convenient AND dangerous.

**Constraint violation in action**:
\`\`\`sql
INSERT INTO products (sku, ...) VALUES ('ABC123', ...);
-- ERROR: duplicate key value violates unique constraint "products_sku_key"
\`\`\`
Application catches this and shows user-friendly error.

## Interview Tips
- Know the six common constraint types
- FK actions (CASCADE, RESTRICT, SET NULL) are commonly asked
- Always index FK columns
- Database constraints + app validation = best practice

## Common Follow-up Questions
1. Why use database constraints if app validates? (Defense in depth — apps have bugs, manual SQL exists)
2. CASCADE risks? (Can cascade delete unintended data — verify carefully)
3. Difference between PRIMARY KEY and UNIQUE? (Primary: one per table, NOT NULL. Unique: many per table, may allow NULL.)`,

    'Distributed Transactions': `## Definition
**Distributed transactions** span multiple databases or services. They require coordination protocols (like Two-Phase Commit) to ensure all participants either commit together or roll back together — preserving atomicity across systems. Modern microservices often replace them with Saga patterns due to their complexity and performance cost.

## Why It Matters
Distributed transactions are critical when data must be consistent across multiple databases — e.g., transferring money between two banks' systems, updating inventory and orders in separate microservices. Understanding their challenges drives modern architecture decisions.

## Detailed Explanation

**The challenge**:
- Single database transaction: ACID via DB engine
- Multiple databases: each has its own transaction; coordinator needed
- What if one commits and another fails? Inconsistent state!

**Two-Phase Commit (2PC)** — classic solution:

**Phase 1 — Prepare**:
1. Coordinator asks all participants: "Can you commit?"
2. Each participant locks resources, writes to log, replies "yes" or "no"
3. If any says "no", coordinator decides to abort

**Phase 2 — Commit/Abort**:
- If all said "yes": coordinator broadcasts "commit"; participants commit
- If any said "no": coordinator broadcasts "abort"; participants roll back

**Pros of 2PC**:
- Atomic across systems
- Standard, well-understood
- Strong consistency

**Cons of 2PC**:
- **Blocking**: Participants hold locks during prepare phase — high latency
- **Coordinator failure**: If coordinator crashes after prepare, participants are stuck "in doubt"
- **Performance**: Multiple round trips, locked resources
- **Network sensitivity**: Network partition can deadlock everything

**Three-Phase Commit (3PC)**:
- Adds a "pre-commit" phase to reduce blocking on coordinator failure
- More complex; rarely used in practice

**XA Transactions** (open standard):
- Implementation of 2PC across heterogeneous databases
- Java's JTA (Java Transaction API) supports XA
- DBs need to support XA driver

**Modern alternatives — Saga pattern**:

Instead of one big distributed transaction, break into smaller local transactions, each with a compensating action:

\`\`\`
Transfer money from A to B:
1. Debit A (local transaction)
2. Credit B (local transaction)

If step 2 fails:
- Compensating action: Re-credit A
\`\`\`

**Two saga styles**:

**1. Choreography**:
- Each service emits events
- Other services react to events
- No central coordinator
- Decentralized, but harder to track

**2. Orchestration**:
- Central orchestrator (Saga manager)
- Tells each service what to do, in order
- Easier to monitor, more centralized

**Saga vs 2PC**:

| Aspect | 2PC | Saga |
|--------|-----|------|
| Atomicity | Strict (all or none) | Eventual (all or compensated) |
| Locks | Long (prepare to commit) | Short (per local transaction) |
| Performance | Slow (network + locks) | Fast (no global locks) |
| Complexity | Lower (well-defined protocol) | Higher (compensations) |
| Failures | Blocks on coordinator failure | Compensations handle failures |
| Microservices fit | Poor (assumes coupling) | Good (loose coupling) |

**Other patterns**:

**1. Outbox pattern**:
- Write to local DB and "outbox" table in same transaction
- Separate process publishes outbox events to message queue
- Eventual consistency with strong local atomicity

**2. Event sourcing**:
- Store events instead of state
- Replay events to compute state
- Natural fit for distributed systems

**3. CQRS (Command Query Responsibility Segregation)**:
- Separate write and read models
- Often combined with event sourcing
- Eventual consistency between models

## Real-World Example
**Booking flight + hotel** (Saga):
1. Reserve flight (local TX)
2. Reserve hotel (local TX)

If hotel fails:
- Compensation: Cancel flight reservation

If hotel succeeds but payment fails:
- Compensation: Cancel hotel + cancel flight

**Bank transfer between banks** (2PC required):
- Strict atomicity needed (money can't disappear)
- 2PC ensures both banks commit or neither
- Central settlement system acts as coordinator

**Microservices order processing**:
- OrderService creates order
- InventoryService reserves items
- PaymentService charges card
- ShippingService creates shipment

If any step fails, saga compensates: cancel order, release inventory, refund payment, etc.

## Interview Tips
- Know 2PC's two phases and failure modes
- Saga is the modern alternative — mention compensations
- 2PC's blocking problem is THE classic concern
- Microservices favor sagas over distributed transactions

## Common Follow-up Questions
1. Why is 2PC blocking? (Participants hold locks waiting for coordinator's commit decision)
2. What if coordinator crashes? (Participants are "in doubt" — need recovery protocol)
3. Saga vs 2PC? (Eventual consistency with compensation vs strict atomicity)`,

    'Database Migrations': `## Definition
**Database migrations** are version-controlled changes to a database schema (and sometimes data) — adding tables, columns, indexes, modifying constraints, transforming existing data. Migration tools track which changes have been applied, ensuring databases evolve consistently across environments.

## Why It Matters
Migrations are how databases evolve safely. Without them, schema changes are ad-hoc, untracked, and risky. Production migration disasters (hours of downtime, data loss) come from unsafe migration practices.

## Detailed Explanation

**Why migrations exist**:
- Schema needs to change as features evolve
- Multiple developers, multiple environments (dev, staging, prod)
- Must keep DB schema in sync with code
- Need rollback capability

**Migration files**:
- Each migration has a timestamp/version + description
- Contains "up" (apply) and often "down" (rollback) operations
- Stored in version control alongside code

**Common formats**:

**Sequelize/TypeORM (Node.js)**:
\`\`\`js
// 20240101_create_users.js
module.exports = {
  up: async (queryInterface) => {
    await queryInterface.createTable('users', {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      email: { type: Sequelize.STRING, unique: true, allowNull: false },
      created_at: Sequelize.DATE
    });
  },
  down: async (queryInterface) => {
    await queryInterface.dropTable('users');
  }
};
\`\`\`

**Flyway (SQL-based)**:
\`\`\`sql
-- V1__create_users.sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- V2__add_phone_column.sql
ALTER TABLE users ADD COLUMN phone VARCHAR(20);
\`\`\`

**Django**: \`python manage.py makemigrations && migrate\`
**Rails**: \`rails generate migration AddPhoneToUsers && rake db:migrate\`
**Liquibase**: XML/YAML/SQL changesets

**Migration tracking**:
- Tool maintains a "migrations" table in DB
- Records which migrations have been applied
- On migrate, applies only new migrations

**Safe migration practices**:

**1. Make migrations backward-compatible**:
- Old code must work with new schema
- New code must work with old schema
- Critical for zero-downtime deployments

**Example — adding a NOT NULL column**:
- ❌ Bad: \`ALTER TABLE users ADD COLUMN status VARCHAR(20) NOT NULL\` — fails if existing rows
- ✅ Good: 
  1. Add column nullable with default
  2. Backfill existing rows
  3. (Optional) Add NOT NULL constraint after

**2. Avoid long-running migrations**:
- \`ALTER TABLE\` on large tables can lock for minutes
- Use online migration tools (pt-online-schema-change for MySQL, pg-osc for PostgreSQL)
- Or chunked updates: \`UPDATE...WHERE id BETWEEN x AND y\` in batches

**3. Make migrations idempotent**:
- Use \`IF NOT EXISTS\` clauses
- Re-running shouldn't fail or duplicate

**4. Test migrations**:
- On staging with prod-like data
- Including rollback path
- Time the migration on representative data

**5. Separate code and schema deploys**:
- Deploy migration first (with backward-compatible changes)
- Deploy new code after
- Or vice versa, depending on the change

**Dangerous operations**:
- **DROP TABLE/COLUMN**: Data loss, can't undo without backup
- **RENAME COLUMN**: Old code breaks immediately
- **CHANGE TYPE**: May fail or lose data
- **ADD UNIQUE constraint**: Fails if duplicates exist

**The expand-and-contract pattern**:

Three deploys for risky changes:

1. **Expand**: Add new column/table, dual-write to old and new
2. **Migrate data**: Backfill new from old; deploy code that reads from new
3. **Contract**: Drop old column/table

For a column rename (\`old_name\` → \`new_name\`):
1. Add \`new_name\`, deploy code that writes both
2. Backfill new_name from old_name; deploy code that reads new_name
3. Drop \`old_name\`

Slow but safe — never breaks production.

**Tools comparison**:

| Tool | Language | Style | Notes |
|------|----------|-------|-------|
| Flyway | SQL | SQL files | Simple, language-agnostic |
| Liquibase | XML/YAML/SQL | Changesets | More features, more complex |
| Sequelize | JS | JS objects | Node.js ORMs |
| Django ORM | Python | Auto-generated | From model changes |
| Alembic | Python | Auto + manual | SQLAlchemy companion |
| Rails | Ruby | DSL | Convention-heavy |
| Goose | Go | SQL or Go | Lightweight |

## Real-World Example
**Adding indexed column on 100M-row table**:
- Naive: \`ALTER TABLE huge ADD COLUMN status...; UPDATE huge SET status = 'old';\` — locks for hours
- Better: 
  1. Add column nullable: \`ALTER TABLE huge ADD COLUMN status VARCHAR(20)\`
  2. Backfill in batches: chunks of 10K rows
  3. Set NOT NULL once backfilled

**Renaming table without downtime**:
1. Create view: \`CREATE VIEW old_name AS SELECT * FROM new_name\`
2. Both work; code reads from either
3. Eventually drop the view

**The classic incident**: Engineer ran \`DROP TABLE users\` on prod instead of dev. Restored from backup, lost 6 hours of writes. Now their migration tool requires confirmation for destructive operations.

## Interview Tips
- Migrations should be reversible (down migrations)
- Backward compatibility for zero-downtime deploys
- Expand-and-contract pattern for risky changes
- Mention tools: Flyway, Liquibase, ORM-specific

## Common Follow-up Questions
1. How to handle long ALTER TABLE? (Online schema change tools, or chunked updates)
2. Why backward-compatible migrations? (Old and new code must coexist during deployment)
3. Should migrations include data changes? (Yes for transformations; large data migrations may need separate batches)`,

    'Database Indexing Strategies': `## Definition
**Indexing strategies** are the patterns and decisions about which indexes to create, what columns to include, and what types to use — to optimize query performance. Good strategies balance query speed against storage cost and write performance overhead.

## Why It Matters
Indexes are the #1 performance lever in databases. The right indexes make queries 1000× faster; the wrong (or missing) indexes make them slow. Strategic indexing is a core database skill.

## Detailed Explanation

**Cost of indexes**:
- **Storage**: Each index takes disk space (often 10-30% of table size)
- **Write overhead**: Every INSERT/UPDATE/DELETE updates indexes
- **Memory**: Indexes consume buffer pool/cache

**Benefit**: Fast SELECT queries.

**Trade-off**: Many indexes = fast reads but slow writes. Few indexes = fast writes but slow reads.

**Index strategies**:

**1. Single-column index**:
\`\`\`sql
CREATE INDEX idx_users_email ON users(email);
\`\`\`
For \`WHERE email = ?\` lookups. Simple, common.

**2. Composite (multi-column) index**:
\`\`\`sql
CREATE INDEX idx_orders_user_date ON orders(user_id, created_at);
\`\`\`
For \`WHERE user_id = ? AND created_at > ?\` or \`WHERE user_id = ? ORDER BY created_at\`.

**Order matters**: \`(a, b)\` index supports queries on \`a\`, on \`a AND b\`, but NOT on just \`b\`. Put more selective and equality columns first.

**3. Covering index**:
\`\`\`sql
CREATE INDEX idx_orders_covering ON orders(user_id, status, total);
\`\`\`
Index contains all columns needed by query — DB doesn't need to read the table. Significantly faster for repeated queries. PostgreSQL: \`INCLUDE\` clause for non-key columns.

**4. Partial (filtered) index**:
\`\`\`sql
CREATE INDEX idx_active_users ON users(email) WHERE status = 'active';
\`\`\`
Only indexes rows matching condition. Smaller, faster. Great for "active records" patterns.

**5. Functional/Expression index**:
\`\`\`sql
CREATE INDEX idx_users_lower_email ON users(LOWER(email));
\`\`\`
For queries like \`WHERE LOWER(email) = ?\`. Without this, function on column prevents index use.

**6. Unique index**:
\`\`\`sql
CREATE UNIQUE INDEX idx_users_email ON users(email);
\`\`\`
Equivalent to UNIQUE constraint. Indexed lookup + uniqueness enforcement.

**7. Hash index**: For exact equality only (PostgreSQL has them, rarely beats B-tree).

**8. Specialized indexes**:
- **GIN/GiST** (PostgreSQL): Full-text search, JSONB, geometric
- **R-Tree**: Spatial data
- **Bitmap**: OLAP, low-cardinality columns
- **LSM-trees**: Write-optimized (Cassandra, RocksDB)

**Choosing indexes**:

**1. Index columns in WHERE**:
- Especially equality conditions
- Range conditions benefit too

**2. Index JOIN columns**:
- Foreign keys ALWAYS need indexes
- Join performance depends on it

**3. Index ORDER BY columns**:
- Avoids sort step
- Must match query's order (ASC/DESC) or composite

**4. Index GROUP BY columns**:
- Hash aggregation is fine, but indexed scan can avoid disk sorts

**5. Don't index everything**:
- Low-cardinality columns (boolean, status with 3 values) — usually not worth it unless partial index
- Columns rarely queried
- Columns frequently updated (write penalty)

**Common pitfalls**:

**1. Missing indexes on FK**:
- DELETE on parent CASCADEs to child — sequential scan if no FK index
- Always index FK columns

**2. Index not used due to function**:
- \`WHERE YEAR(created_at) = 2024\` — disables index
- Better: \`WHERE created_at >= '2024-01-01' AND created_at < '2025-01-01'\`

**3. Over-indexing**:
- Every query needs custom index? Probably wrong
- Reuse composite indexes for multiple queries

**4. Wrong column order in composite**:
- \`(b, a)\` index doesn't help \`WHERE a = ?\` queries
- Most selective + equality columns first

**5. Implicit type cast**:
- \`WHERE phone_str = 12345\` (number compared to string) — implicit cast disables index
- Match types

**Index maintenance**:
- **REINDEX** (PostgreSQL): Rebuild bloated indexes
- **OPTIMIZE TABLE** (MySQL): Rebuilds indexes
- **VACUUM** (PostgreSQL): Reclaims space from dead rows
- Statistics update: \`ANALYZE\` for optimizer

**Index monitoring**:
\`\`\`sql
-- PostgreSQL: Find unused indexes
SELECT * FROM pg_stat_user_indexes WHERE idx_scan = 0;

-- MySQL: Index usage stats
SELECT * FROM sys.schema_unused_indexes;
\`\`\`

Drop unused indexes — they waste space and slow writes.

## Real-World Example
**E-commerce optimization**:
- Initial schema: only PK indexes
- Slow queries: \`WHERE user_id = ?\`, \`WHERE status = 'pending' ORDER BY created_at\`
- Add: \`idx_orders_user_id\`, \`idx_orders_status_created\` (partial: WHERE status = 'pending')
- 100x query speedup

**Logging table** (write-heavy, rarely queried):
- Strategy: minimal indexes (only PK + maybe time-based partition key)
- Heavy indexing would slow ingestion
- Trade-off: queries scan more, but logs rarely queried interactively

**Search feature** (full-text):
- B-tree useless for "contains word"
- PostgreSQL GIN index on \`tsvector(description)\` — full-text search support
- Alternative: external search engine (Elasticsearch)

## Interview Tips
- Know composite index column order matters (most selective first)
- Covering indexes for hot queries
- Always index FK columns
- Mention monitoring unused indexes — drop them

## Common Follow-up Questions
1. When NOT to add an index? (Frequent writes + rare reads, low cardinality)
2. Composite vs multiple single-column indexes? (Composite better for AND queries; multiple help OR queries via index merge)
3. What's a covering index? (Includes all columns needed by query — no table fetch)`,

    'Foreign Key Cascading': `## Definition
**Foreign key cascading** refers to actions that automatically propagate from a parent row to child rows when the parent is updated or deleted. The main options are CASCADE, SET NULL, RESTRICT/NO ACTION, and SET DEFAULT — each defining how to handle child rows when their referenced parent changes.

## Why It Matters
Cascading affects data integrity and can cause silent data loss if misconfigured. Understanding the options is essential for designing robust schemas — and avoiding production "where did all my data go?" incidents.

## Detailed Explanation

**The setup**:
\`\`\`sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100)
);

CREATE TABLE orders (
  id SERIAL PRIMARY KEY,
  user_id INT REFERENCES users(id) ON DELETE [ACTION] ON UPDATE [ACTION],
  total DECIMAL(10,2)
);
\`\`\`

What happens to orders when their user is deleted/updated? Defined by ON DELETE / ON UPDATE actions.

**The five actions**:

**1. NO ACTION** (default in most DBs):
- Prevents the parent operation if children exist
- Error: "violates foreign key constraint"
- Most conservative — explicit cleanup required

**2. RESTRICT**:
- Same as NO ACTION but checked immediately (NO ACTION can be deferred in some DBs)
- Prevents the operation
- "You must delete children first"

**3. CASCADE**:
- Automatically applies the same operation to children
- ON DELETE CASCADE: parent deleted → children deleted
- ON UPDATE CASCADE: parent's PK updated → children's FK updated to match

**4. SET NULL**:
- Children's FK set to NULL when parent operation occurs
- Requires FK column to allow NULL
- Children become "orphaned" but exist

**5. SET DEFAULT**:
- Children's FK set to its DEFAULT value
- Default must be a valid foreign key (or NULL)
- Less commonly used

**Comparison**:

| Action | What happens to children |
|--------|--------------------------|
| NO ACTION / RESTRICT | Operation prevented |
| CASCADE | Same operation propagates |
| SET NULL | FK set to NULL |
| SET DEFAULT | FK set to default value |

**When to use each**:

**ON DELETE CASCADE — appropriate for**:
- True ownership: parent owns child completely
- Examples: Order → OrderItems (delete order, items make no sense)
- Comments on a deleted post
- Tags on a deleted product

**ON DELETE SET NULL — appropriate for**:
- Loose association — child doesn't depend on parent
- Examples: Department → Employees (department removed, employees still exist)
- "Author" reference that becomes "Anonymous"

**ON DELETE RESTRICT — appropriate for**:
- Reference data that's important
- Examples: User accounts that own paid services (must reassign first)
- Critical relationships requiring explicit handling

**ON UPDATE CASCADE — appropriate for**:
- When PKs can change (rare in modern designs)
- Most modern systems use surrogate immutable PKs (auto-increment IDs), so UPDATE rarely matters

**Cascade depth and chains**:

If A → B → C with cascading deletes:
- Delete A → Delete B → Delete C
- Can cascade through deep hierarchies
- Surprisingly far-reaching effects

\`\`\`sql
-- Delete user → cascades to orders → cascades to order_items → cascades to ...
\`\`\`

**Always test thoroughly** — a careless ON DELETE CASCADE can wipe out massive related data.

**Performance considerations**:

**1. Cascade requires index on FK**:
- Without index: full table scan to find children
- Always index FK columns

**2. Bulk operations**:
- Deleting parent with many children → many cascade operations
- Can be slow; consider batching manually

**3. Triggers vs cascades**:
- Cascades are simpler and DB-enforced
- Triggers offer more flexibility but more complexity

**Soft delete alternative**:

Instead of cascading deletes, many systems use soft deletes:
\`\`\`sql
ALTER TABLE users ADD deleted_at TIMESTAMP;
-- "Delete" by setting deleted_at = NOW()
-- Queries filter WHERE deleted_at IS NULL
\`\`\`

Pros:
- Recoverable
- Audit trail
- No cascade surprises

Cons:
- Filter every query
- Storage grows
- Complicates uniqueness (need partial unique index)

**ORM-level cascading**:

ORMs like Hibernate, Sequelize, Django can manage cascades at application level — separate from DB constraints. Watch for:
- Inconsistencies if both DB and ORM cascade
- ORM cascades can be slower (multiple queries)
- DB cascades atomic; ORM cascades may not be

## Real-World Example
**Forum schema**:
\`\`\`sql
posts(id, user_id, title, content)
comments(id, post_id, user_id, content)

ALTER TABLE comments
  ADD CONSTRAINT fk_post FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE;
ALTER TABLE comments
  ADD CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL;
\`\`\`
- Delete post → comments deleted (they belonged to that post)
- Delete user → their comments stay (anonymous), with NULL user_id

**Bank schema** (avoid CASCADE):
\`\`\`sql
accounts(id, user_id, balance)
transactions(id, account_id, amount, type)

-- ON DELETE RESTRICT: can't delete account if it has transactions
-- Force explicit handling — transactions are too important to silently delete
\`\`\`

**Production disaster**: Engineer added \`ON DELETE CASCADE\` to a "tags" table. A test cleanup deleted all tags → cascaded to thousands of products. Restore took hours. Now they prefer SET NULL or no cascade.

## Interview Tips
- CASCADE is convenient but dangerous — test thoroughly
- SET NULL for loose associations
- RESTRICT for "must handle explicitly"
- Always index FK columns for cascade performance
- Soft deletes as an alternative to hard cascading

## Common Follow-up Questions
1. CASCADE vs SET NULL? (CASCADE deletes children; SET NULL makes them anonymous/orphaned)
2. Why might CASCADE be dangerous? (Far-reaching unintended deletions)
3. ORM cascade vs DB cascade? (DB: atomic, faster. ORM: more flexible, can run hooks.)`,

    'Database Caching': `## Definition
**Database caching** is the practice of storing frequently-accessed query results or data in faster storage (memory, dedicated cache servers) to reduce database load and latency. Common approaches include in-memory query caches, application-level caches (Redis, Memcached), and CDN-style edge caches.

## Why It Matters
Caching is the most powerful tool for scaling read-heavy databases. Done right, it can handle 100x more traffic with the same database. Done wrong, it creates stale data and consistency bugs.

## Detailed Explanation

**Levels of caching**:

**1. Database internal caching**:
- Buffer pool / page cache: hot pages in memory
- Query result cache: caches identical query results (MySQL: removed in 8.0)
- Adaptive Hash Index (InnoDB): auto-cached hot lookups

**2. Application-level cache**:
- Redis, Memcached
- Cache results in app memory
- Most flexible and common

**3. ORM/framework caches**:
- First-level (per-session): identity map
- Second-level (cross-session): shared object cache
- Hibernate, JPA support these

**4. HTTP / CDN cache**:
- Cache full API responses
- Edge caching (CloudFlare, Fastly)
- For read-heavy public data

**Caching patterns**:

**1. Cache-Aside (Lazy loading)**:
\`\`\`
get(key):
  data = cache.get(key)
  if data is None:
    data = db.query(key)
    cache.set(key, data, ttl=600)
  return data
\`\`\`
- App manages cache explicitly
- Cache miss → DB read → populate cache
- Common, simple
- Risk: stale data after DB updates

**2. Write-Through**:
\`\`\`
put(key, value):
  db.update(key, value)
  cache.set(key, value)
\`\`\`
- Every write goes to DB AND cache
- Slow writes (two systems updated)
- Cache always consistent

**3. Write-Behind (Write-Back)**:
\`\`\`
put(key, value):
  cache.set(key, value)  // immediate
  queue_async_db_write(key, value)
\`\`\`
- Writes to cache first, DB later
- Fast writes
- Risk of data loss if cache crashes before DB write

**4. Read-Through**:
- Cache automatically loads from DB on miss
- App talks only to cache
- Examples: caching libraries with auto-load
- Simpler API but harder to debug

**5. Refresh-Ahead**:
- Refresh cached data before TTL expires
- Predictive — based on usage patterns
- Useful for avoiding stampede on expiry

**Cache invalidation strategies**:

The famous Phil Karlton quote: "There are only two hard things in Computer Science: cache invalidation and naming things."

**1. Time-based (TTL)**:
- Expire after N seconds
- Simple
- Stale data during TTL window

**2. Explicit invalidation**:
- App invalidates on DB updates
- Fresh data
- Easy to miss invalidations → stale forever

**3. Event-based**:
- DB triggers / change data capture (CDC) → invalidate cache
- More automatic
- Complex infrastructure

**4. Versioning**:
- Cache key includes version: \`user:123:v5\`
- Bump version on update — old key becomes orphaned
- Avoids stale-cache bugs but accumulates garbage

**Cache patterns by data type**:

**1. Hot reads** (user profiles): Cache-aside with 5-minute TTL.
**2. Frequently-changing** (real-time feeds): Don't cache, or very short TTL (seconds).
**3. Computed aggregates** (counts, sums): Cache + invalidate or rebuild periodically.
**4. Rarely-changing** (configuration): Long TTL with explicit invalidation.

**Cache stampede / thundering herd**:

When a popular cache entry expires, many requests hit the DB simultaneously to rebuild it. Solutions:

- **Lock during rebuild**: First request rebuilds, others wait
- **Probabilistic early refresh**: Some requests refresh before TTL expires
- **Stale-while-revalidate**: Serve stale data, rebuild in background

**Cache eviction policies** (when cache full):

- **LRU (Least Recently Used)**: Most common
- **LFU (Least Frequently Used)**: Better for hot/cold patterns
- **FIFO**: Simplest
- **Random**: Surprisingly works
- **TTL**: Time-based expiry

**Distributed caching considerations**:

- **Sharding**: Spread cache across nodes (consistent hashing)
- **Replication**: Cache replicas for availability
- **Cluster vs sentinel**: Redis Cluster vs Sentinel patterns
- **Write coordination**: Stale data on read-only replicas

**Common pitfalls**:

**1. Cache penetration**: Lookups for non-existent keys hit DB every time. Solution: cache "not found" results too.

**2. Cache avalanche**: Many keys expire simultaneously. Solution: jitter TTLs.

**3. Hot key**: One key gets disproportionate traffic. Solution: replicate to multiple cache nodes.

**4. Inconsistency**: Cache and DB diverge. Most common cause of "weird bugs."

**5. Over-caching**: Caching everything bloats memory, complicates debugging.

## Real-World Example
**Twitter timeline**: Aggressive caching at every layer:
- Tweets cached by ID in Redis
- Timelines (per-user feed) precomputed and cached
- CDN caches static content
- Most reads served from cache; DB rarely touched

**E-commerce product page**:
- Cache-aside on product details (5-min TTL)
- Inventory NOT cached (must be fresh)
- User-specific data (cart) per-session in cache
- Reviews cached but invalidated on new review

**Database query result cache** (MySQL pre-8.0):
- Same query → cached result returned
- Removed in 8.0 — too many edge cases
- Modern approach: app-level caching is more flexible

**Stripe-like systems**: Almost no caching of customer data — too critical to be stale. Caching limited to public data (product catalog, pricing tiers).

## Interview Tips
- Know cache patterns: cache-aside, write-through, write-behind
- Cache invalidation is the hardest part — discuss strategies
- Mention thundering herd, cache stampede
- Real-world: Redis is the de facto choice for app caching

## Common Follow-up Questions
1. Cache-aside vs write-through? (Lazy loading vs immediate sync — different consistency/perf trade-offs)
2. How to invalidate cache on DB update? (Explicit invalidation, TTL, event-based via CDC)
3. What's a cache stampede? (Many requests rebuilding same expired key — lock or staggered refresh)`,

    'Eventual Consistency': `## Definition
**Eventual consistency** is a consistency model used in distributed systems where, given enough time without new updates, all replicas of a piece of data will converge to the same value. It's weaker than strong consistency but enables much higher availability and performance.

## Why It Matters
Eventual consistency is the trade-off behind massive scalability. Most internet-scale systems (DynamoDB, Cassandra, S3) use it. Understanding when it's acceptable — and how to handle its quirks — is essential for distributed system design.

## Detailed Explanation

**Strong consistency**:
- All readers see the same data immediately after a write
- Single source of truth
- Easier to reason about
- Costly: requires coordination across replicas

**Eventual consistency**:
- Replicas may temporarily diverge after writes
- Eventually (seconds, milliseconds), all converge
- Higher availability and performance
- Harder to reason about

**Why eventual consistency**:

**CAP theorem**: Can't have all three of Consistency, Availability, Partition tolerance. Eventually consistent systems prioritize A+P.

**Performance**: No waiting for all replicas to acknowledge. Write returns fast.

**Geographic distribution**: Replicas in multiple regions can serve local reads/writes; reconcile asynchronously.

**Common eventually-consistent operations**:

- DNS (changes propagate over hours)
- S3 (write may not immediately appear in list)
- Cassandra (configurable consistency levels)
- DynamoDB (eventually consistent reads cheaper than strongly consistent)
- Social media counters, view counts
- Replicated databases with async replication

**Anomalies you might see**:

**1. Read-your-writes inconsistency**:
- User updates profile
- Reads profile back (different replica) — sees old version
- "Did my update fail?"

**Solution**: Read-your-writes consistency — route the user to the same replica or use sticky sessions.

**2. Monotonic reads inconsistency**:
- User refreshes page
- First refresh: sees latest data
- Second refresh: hits stale replica, sees older data
- "Time went backwards!"

**Solution**: Monotonic reads — guarantee subsequent reads don't go backwards.

**3. Writes appearing out of order**:
- User posts comment, edits comment
- Other user sees edit before original post
- Confusing causality

**Solution**: Causal consistency — preserve order of related operations.

**Convergence — how replicas reconcile**:

**1. Last-Write-Wins (LWW)**:
- Each write has a timestamp; latest wins
- Simple but loses data if two clients write concurrently
- Used in Cassandra by default

**2. Vector clocks**:
- Each replica maintains version vector
- Detect concurrent updates
- Application resolves conflicts (e.g., "merge shopping carts")
- Used in Riak, DynamoDB (older versions)

**3. CRDTs (Conflict-Free Replicated Data Types)**:
- Mathematical structures that always converge regardless of order
- Examples: counters, sets, maps
- Application doesn't need to resolve conflicts
- Used in Redis CRDTs, collaborative editors

**4. Manual conflict resolution**:
- App is told about conflict, user picks
- Used in Couchbase, Git (merge conflicts)

**Consistency levels in practice**:

**Cassandra/DynamoDB tunable consistency**:

| Level | Description |
|-------|-------------|
| ONE | One replica responds |
| QUORUM | Majority of replicas respond |
| ALL | All replicas respond |

\`\`\`
W (write level) + R (read level) > N (replicas) → strong consistency
W=2 + R=2 > N=3 ✓ — strong consistency, slower
W=1 + R=1 < N=3 — eventual consistency, fast
\`\`\`

**When eventual consistency is fine**:
- Read counters (views, likes)
- Recently uploaded photos (delay acceptable)
- Friend lists, news feeds
- Search indexes (newly indexed content has delay)
- Analytics

**When you need strong consistency**:
- Financial transactions
- Inventory (don't oversell)
- Authorization (just-revoked tokens shouldn't work)
- Distributed locks
- Account balances

**BASE vs ACID**:

ACID (traditional): Atomicity, Consistency, Isolation, Durability — strong guarantees.

BASE (eventually consistent systems):
- **Basically Available**: System mostly available
- **Soft state**: State may change without input (replication)
- **Eventually consistent**: Will converge

## Real-World Example
**Facebook likes counter**:
- Hundreds of thousands of likes per second
- Strong consistency would require global coordination
- Instead: each datacenter counts independently, periodically sync
- Users see slightly different counts briefly — acceptable trade-off

**Amazon shopping cart**:
- Originally written about in DynamoDB paper
- Eventually consistent — adding item rarely conflicts
- On checkout, conflicts resolved (merge carts from different replicas)
- "Always available" — even during partitions

**Twitter timeline**:
- Following someone may take seconds to fully propagate
- Tweets posted appear in your feed within seconds (not instant)
- Trade-off accepted for scale

**S3 object storage**:
- Historically eventually consistent (now strongly consistent since 2020)
- Old issue: PUT object, immediate LIST might not show it
- Strong consistency now standard, but other systems still face this

## Interview Tips
- Eventual consistency = available + partition tolerant (AP)
- Mention CAP theorem connection
- Read-your-writes is a common UX issue — know the term
- Vector clocks, CRDTs are advanced credibility-builders

## Common Follow-up Questions
1. Eventual vs strong consistency? (Wait for all vs allow drift)
2. How long until "eventually"? (Usually milliseconds; sometimes seconds; rarely minutes)
3. What's read-your-writes consistency? (Subset of eventual: a user always sees their own updates)`,

    'Database Connection Pooling': `## Definition
**Connection pooling** is a technique that maintains a cache of pre-established database connections, reusing them across application requests rather than creating new connections each time. It dramatically reduces connection overhead and limits resource usage.

## Why It Matters
Database connections are expensive: TCP handshake, authentication, session setup. For high-traffic apps, opening a new connection per request would be a major bottleneck. Connection pools are essential infrastructure.

## Detailed Explanation

**Cost of opening a connection**:
- TCP handshake (3-way)
- TLS handshake (multiple round trips)
- Database authentication
- Session initialization
- Total: 10-100ms typically

**For a request that runs a 5ms query**, opening a connection per request means 95% of time is connection setup. Massive waste.

**Connection pool basics**:

\`\`\`
Pool: [conn1, conn2, conn3, ... connN]

Request handler:
  conn = pool.acquire()  // get a free connection
  result = conn.query(...)
  pool.release(conn)  // return to pool
\`\`\`

Connections are pre-created at startup; requests borrow and return them.

**Pool configuration parameters**:

**1. Min connections**:
- Always keep at least N connections open
- Fast response under sudden load
- Wastes resources if traffic is low

**2. Max connections**:
- Hard limit — never exceed this many
- Protects DB from overwhelming
- Requests wait when all connections busy

**3. Idle timeout**:
- Close connections idle longer than N seconds
- Frees resources during quiet periods

**4. Connection timeout**:
- Time to wait for an available connection
- After this, request fails (better than hanging forever)

**5. Validation query**:
- Test connection health before lending it out
- Detects stale connections (network drops, DB restarts)
- Adds slight overhead per acquisition

**Tuning the pool**:

**Pool size formula** (Brett Wooldridge, HikariCP):
\`\`\`
connections = ((core_count × 2) + effective_spindle_count)
\`\`\`

For modern SSDs and 8-core servers: ~16-20 connections.

**Common mistake**: People think more connections = more parallelism. Often opposite — too many connections cause context switching, lock contention.

**Database-side limit**:
- PostgreSQL: \`max_connections\` parameter (default 100)
- MySQL: \`max_connections\` (default 151)
- Each connection takes RAM (~10 MB on PostgreSQL)
- App pool size × number of app servers must fit DB limit

**External pooling (PgBouncer, ProxySQL)**:
- Centralized pooler between app and DB
- App connects to pooler (cheap)
- Pooler maintains DB connections
- Useful for many small app servers (serverless, Lambda)

**Pooling modes**:
- **Session pooling**: Connection assigned for whole session — like direct connection
- **Transaction pooling**: Connection released between transactions — more concurrency
- **Statement pooling**: Released between statements — most aggressive but breaks features

**Common pool libraries**:

**Java**:
- **HikariCP**: Fastest, most popular
- **Apache DBCP**, **C3P0**: Older, slower

**Python**:
- **SQLAlchemy** built-in pool
- **psycopg2** with PgBouncer

**Node.js**:
- **pg-pool** (PostgreSQL)
- **mysql2** with pool support

**Go**:
- \`database/sql\` has built-in pool
- Configure with \`SetMaxOpenConns\`, \`SetMaxIdleConns\`

**Common issues**:

**1. Pool exhaustion**:
- All connections in use, requests waiting
- Symptoms: timeouts, slow responses
- Fix: increase pool size (within DB limits), find slow queries holding connections

**2. Connection leaks**:
- Code doesn't release connection (forgot to close)
- Pool slowly empties
- Defense: try-with-resources, RAII, close in finally

**3. Stale connections**:
- DB or network dropped connection while pool thinks it's good
- Validation query detects and replaces

**4. Long-running transactions**:
- Connection held for entire transaction
- Other requests wait
- Keep transactions short

**5. Per-request connection inappropriate**:
- Some workloads need exclusive connection (transaction, listener)
- Don't return to pool prematurely

**Monitoring**:
- Active connections vs idle
- Wait time for connections
- Connection lifetime
- Errors / failures

## Real-World Example
**Web app with 100 RPS, 50ms avg query time**:
- Active queries at any moment: 100 × 0.05 = 5
- Pool size: 10-20 should be ample (with safety margin)
- DB max_connections: handle pool × all servers

**Traffic spike**:
- Pool size = 10, sudden 100x traffic
- All connections busy, requests queue
- Either: increase pool, scale DB, or add cache layer

**Lambda/serverless trap**:
- Each Lambda instance opens its own connections
- 1000 concurrent Lambdas × 10 conn each = 10,000 connections
- DB blows up
- Fix: PgBouncer in front, smaller per-Lambda pool

**Microservice pattern**:
- Each microservice has its own pool
- DB has total budget across all services
- Plan accordingly: 10 services × 10 conn each = 100 against DB limit of 100 = no room

## Interview Tips
- Pool size formula: roughly 2× CPU cores
- Mention HikariCP for Java
- Lambda + DB connections is a classic gotcha
- PgBouncer for centralized pooling

## Common Follow-up Questions
1. Why not unlimited connections? (Each connection costs DB memory; too many cause contention)
2. What's connection leak? (Code that acquires but doesn't release — slowly drains pool)
3. PgBouncer use case? (Many small app servers / Lambda — centralize connections, fewer to DB)`,

    'ACID vs BASE': `## Definition
**ACID** (Atomicity, Consistency, Isolation, Durability) describes the strong transactional guarantees of traditional databases. **BASE** (Basically Available, Soft state, Eventually consistent) describes the looser guarantees of distributed/NoSQL databases that prioritize availability and partition tolerance.

## Why It Matters
ACID and BASE represent the two main philosophies for data consistency. Choosing between them is one of the most fundamental architectural decisions for a system. The choice depends on the application's tolerance for stale data versus its need for availability and scale.

## Detailed Explanation

**ACID** (relational databases, traditional):

**A — Atomicity**: A transaction is all-or-nothing. Either every operation completes, or none do.

**C — Consistency**: Transactions take the database from one valid state to another. All constraints (FK, CHECK, UNIQUE) hold.

**I — Isolation**: Concurrent transactions don't interfere. Each appears to run in isolation.

**D — Durability**: Once committed, changes survive crashes. Stored permanently.

**Examples**: PostgreSQL, MySQL (InnoDB), Oracle, SQL Server, SQLite.

**BASE** (NoSQL, distributed):

**BA — Basically Available**: System available most of the time. May serve stale data during partitions.

**S — Soft State**: State may change without explicit user input (due to replication, eventual consistency).

**E — Eventually Consistent**: Given enough time without writes, replicas converge.

**Examples**: Cassandra, DynamoDB, Riak, Couchbase.

**Comparison**:

| Aspect | ACID | BASE |
|--------|------|------|
| Consistency | Strong | Eventual |
| Availability | Sacrificed during conflicts | Always available |
| Partition tolerance | Limited (chooses CP) | High (chooses AP) |
| Schema | Fixed | Flexible |
| Scalability | Vertical (mostly) | Horizontal (mostly) |
| Use cases | Financial, transactional | Social media, IoT, big data |
| Complexity for app | Lower (DB handles) | Higher (handle conflicts) |

**Why the difference matters**:

**ACID — predictable, rigid**:
- Every transaction has a clear outcome
- Easy to reason about
- Locks reduce concurrency under load
- Doesn't scale to global distribution easily

**BASE — flexible, scalable**:
- Available even during failures
- Massively scalable horizontally
- Stale reads possible
- Application must handle conflicts

**CAP theorem perspective**:
- ACID systems = CP (Consistency + Partition tolerance, sacrifice Availability during partition)
- BASE systems = AP (Availability + Partition tolerance, sacrifice Consistency)

**The middle ground**:

Modern systems often offer choices:

**Cassandra**: Tunable consistency (per-query CONSISTENCY level)
**MongoDB**: Configurable read/write concerns
**Spanner**: ACID across globally distributed system (using TrueTime)
**CockroachDB**: ACID across distributed cluster

**Real-world hybrid**:
- Use ACID DB (PostgreSQL) for transactional data
- Use BASE DB (Redis, Elasticsearch) for caches, search
- Most large systems combine multiple

**Examples by use case**:

**ACID needed**:
- Bank transfers (atomic — both accounts updated)
- Inventory (no overselling)
- Order processing (cart + payment + stock)
- Financial accounting

**BASE acceptable**:
- View counts, like counts (slight inaccuracy fine)
- Social media feeds (eventual delivery OK)
- Search indexes (lag acceptable)
- IoT data ingestion (massive write volume)
- Session storage (low consistency need)
- Analytics (batch-processed anyway)

**Application implications**:

**ACID applications**:
- Use transactions: \`BEGIN; ... COMMIT;\`
- Trust DB constraints
- Simpler error handling

**BASE applications**:
- Handle conflicts in code (last-write-wins, merge logic, vector clocks)
- Implement retry logic for inconsistencies
- Design idempotent operations (safe to retry)
- Use compensating actions instead of rollbacks

**Saga pattern** for distributed BASE systems:
- Multi-step process with compensation if any step fails
- Replaces distributed ACID transactions

**Misconceptions**:

**"NoSQL means BASE"**:
- Not always! MongoDB transactions support ACID since v4.0
- Couchbase has multi-document ACID

**"SQL means ACID always"**:
- MySQL with MyISAM is not ACID (no transactions)
- Most SQL servers ACID by default with InnoDB/proper engine

**"You can't have both"**:
- Modern distributed databases (Spanner, CockroachDB) provide ACID at scale
- Trade-offs in latency or hardware (atomic clocks for Spanner)

## Real-World Example
**Banking — strict ACID**:
- Transferring money: atomic across two accounts
- PostgreSQL or Oracle in synchronous replication
- Rather have brief unavailability than risk inconsistent balances

**Twitter — BASE**:
- Posting a tweet: eventually visible to followers
- Cassandra/HBase for tweet storage
- Geo-distributed; stale data acceptable for scale

**E-commerce — both**:
- Orders, payments: ACID (PostgreSQL)
- Product browsing, search: BASE (Elasticsearch, Redis cache)
- Inventory updates: ACID with strong consistency
- View counts, ratings: BASE (eventual)

**Analytics platform**:
- Ingestion: BASE (Kafka, Cassandra) — accept all data fast
- Reporting: ACID-ish (data warehouse with snapshots)
- Real-time queries: BASE (Druid, ClickHouse)

## Interview Tips
- Memorize both acronyms
- ACID for "must be right"; BASE for "must scale"
- Mention CAP theorem connection
- Modern systems blur the line — Spanner, CockroachDB

## Common Follow-up Questions
1. Can NoSQL be ACID? (Yes — MongoDB, Couchbase support ACID transactions now)
2. How do BASE systems handle conflicts? (LWW, vector clocks, CRDTs, app-level resolution)
3. Why pick ACID over BASE? (When data correctness > availability or scale; financial, transactional)`,

    'Database Partitioning': `## Definition
**Database partitioning** is the technique of dividing a large database table or dataset into smaller, more manageable pieces (partitions) while still treating them as a single logical entity. Partitioning improves query performance, manageability, and scalability for large tables.

## Why It Matters
Tables with billions of rows become unmanageable — slow queries, long backups, slow ALTER TABLE. Partitioning addresses these by splitting data into independent chunks. It's a fundamental technique for scaling databases.

## Detailed Explanation

**Partitioning vs Sharding**:
- **Partitioning**: Splitting a table within ONE database (sometimes called "horizontal partitioning")
- **Sharding**: Splitting a database across MULTIPLE machines
- Partitioning is local; sharding is distributed
- Often used together: sharded database with partitioned tables on each shard

**Types of partitioning**:

**1. Range Partitioning**:
- Partition by ranges of a column
- Common: time-based (orders by month)

\`\`\`sql
CREATE TABLE orders (
  id BIGINT, created_at DATE, total NUMERIC
) PARTITION BY RANGE (created_at);

CREATE TABLE orders_2024_01 PARTITION OF orders
  FOR VALUES FROM ('2024-01-01') TO ('2024-02-01');
CREATE TABLE orders_2024_02 PARTITION OF orders
  FOR VALUES FROM ('2024-02-01') TO ('2024-03-01');
\`\`\`

Use cases: time-series data, logs, financial records (archive old months easily).

**2. List Partitioning**:
- Partition by discrete values
- Example: customers by country

\`\`\`sql
CREATE TABLE customers (...)
PARTITION BY LIST (country);

CREATE TABLE customers_us PARTITION OF customers FOR VALUES IN ('US');
CREATE TABLE customers_eu PARTITION OF customers FOR VALUES IN ('UK', 'DE', 'FR');
\`\`\`

Use cases: clear categorical division (region, type, status).

**3. Hash Partitioning**:
- Partition by hash of column
- Even distribution

\`\`\`sql
CREATE TABLE users (...)
PARTITION BY HASH (id);

CREATE TABLE users_p0 PARTITION OF users FOR VALUES WITH (modulus 4, remainder 0);
CREATE TABLE users_p1 PARTITION OF users FOR VALUES WITH (modulus 4, remainder 1);
... and so on
\`\`\`

Use cases: when no natural range/list partition fits; load balancing.

**4. Composite (Sub-) Partitioning**:
- Partition by one scheme, sub-partition by another
- Example: range by date, then hash by user_id

**Benefits of partitioning**:

**1. Query performance — partition pruning**:
- Optimizer skips partitions not matching the WHERE clause
- \`WHERE created_at > '2024-01-01'\` reads only recent partitions
- Massive speedup for selective queries

**2. Maintenance**:
- DROP a whole partition (vs DELETE millions of rows): instant
- VACUUM, REINDEX per partition (smaller chunks)
- ATTACH/DETACH partitions for archive/restore

**3. Easier archival**:
- Old data in cold-storage partitions
- Recent in hot partitions
- DETACH old partitions and store on cheaper storage

**4. Improved indexing**:
- Smaller indexes per partition
- Better cache behavior
- Faster index lookups

**Drawbacks**:

**1. Cross-partition queries are slower**:
- \`SELECT * FROM orders\` (no WHERE) — scans all partitions

**2. Constraints across partitions are tricky**:
- UNIQUE across all partitions requires special handling
- FK from non-partitioned tables work; partitioned-to-partitioned is harder

**3. Complexity**:
- More schema maintenance
- Partition key choice matters and is hard to change later

**4. Some operations are harder**:
- Foreign keys across partitions
- Triggers on partitioned tables (mostly works in modern DBs)

**Choosing a partition key**:
- Should match common WHERE clauses (for pruning)
- Reasonable distribution (avoid hot partition)
- Stable (changing partition key requires data movement)

**Examples by database**:

**PostgreSQL**: Native declarative partitioning since v10. Range, list, hash. Mature in v12+.

**MySQL**: Native partitioning. Range, list, hash, key. Some limitations with foreign keys.

**Oracle**: Most mature partitioning, extensive features. Range, list, hash, composite.

**SQL Server**: Partition functions and schemes. Complex setup but powerful.

**Cassandra/MongoDB**: Built-in partitioning (sharding) — distributed by default.

**Common patterns**:

**Time-based with retention policy**:
\`\`\`
- Partition orders by month
- Keep 24 months in production
- Archive older partitions to cheaper storage
- DROP partitions older than 5 years
\`\`\`

**Multi-tenant by tenant_id**:
\`\`\`
- Hash partition by tenant_id
- Each tenant's data co-located
- Easy to filter or isolate one tenant
\`\`\`

**Geographic by region**:
\`\`\`
- List partition by country/region
- Query for region only touches that partition
- Comply with data residency laws (EU data in EU partition)
\`\`\`

## Real-World Example
**Logging system**:
- Events table: 100 GB per month
- Range partition by day
- Keep 90 days in hot storage; older detached and archived to S3
- Query "errors in last 24 hours" reads only 1-2 partitions

**E-commerce orders**:
- Orders table: 1 billion rows
- Range partition by month
- Reports filter by date range — partition pruning massive speedup
- Yearly archive: detach old year's partitions

**SaaS multi-tenant**:
- Hash partition customer data by tenant_id
- Customer queries always filter by tenant_id → only their partition scanned
- Avoids data leakage between tenants

## Interview Tips
- Range, list, hash — know the three types
- Partition pruning is the key performance benefit
- Time-based range partitioning is most common
- Distinguish from sharding (within DB vs across DBs)

## Common Follow-up Questions
1. Partitioning vs sharding? (Within one DB vs across multiple DBs)
2. What's partition pruning? (Query optimizer skips partitions not matching WHERE)
3. Can you change partition key? (Hard — usually requires data migration. Plan carefully.)`,

    'Materialized Views': `## Definition
A **materialized view** is a database object that stores the results of a query as a physical table, unlike regular views which compute the query each time. Materialized views provide fast access to expensive query results at the cost of storage and the need for refreshing when underlying data changes.

## Why It Matters
For complex aggregations or joins that are queried frequently but don't change often, materialized views are the perfect optimization. They're widely used in data warehouses, reporting dashboards, and search systems.

## Detailed Explanation

**View vs Materialized View**:

**Regular View**:
- Stored query definition
- Re-executed every time queried
- Always fresh
- No storage cost (other than definition)
- Performance same as underlying query

**Materialized View**:
- Stored query RESULTS
- Acts like a table on disk
- Fast queries (just read precomputed data)
- Storage cost (data is stored)
- Stale until refreshed

**Creating a materialized view**:
\`\`\`sql
-- PostgreSQL
CREATE MATERIALIZED VIEW monthly_sales AS
SELECT 
  DATE_TRUNC('month', order_date) AS month,
  SUM(amount) AS total,
  COUNT(*) AS order_count
FROM orders
GROUP BY DATE_TRUNC('month', order_date);

-- Refresh
REFRESH MATERIALIZED VIEW monthly_sales;
\`\`\`

Querying it is super fast:
\`\`\`sql
SELECT * FROM monthly_sales;  -- just reads stored rows
\`\`\`

vs the equivalent query without materialization, which would aggregate millions of rows each time.

**Refresh strategies**:

**1. On-demand (manual)**:
\`\`\`sql
REFRESH MATERIALIZED VIEW monthly_sales;
\`\`\`
Triggered by app or scheduled job.

**2. Scheduled (cron)**:
- Refresh every hour, day, week
- Acceptable staleness
- Predictable load

**3. CONCURRENT refresh** (PostgreSQL):
\`\`\`sql
REFRESH MATERIALIZED VIEW CONCURRENTLY monthly_sales;
\`\`\`
- Doesn't lock the view during refresh
- Requires UNIQUE index on view
- Slower but no downtime

**4. Incremental refresh**:
- Only update changed parts (not full rebuild)
- Manual implementation (track last refresh, update only newer data)
- More complex; some DBs support natively

**5. Trigger-based**:
- Triggers on underlying tables update materialized view
- Real-time freshness
- Performance overhead on every write

**Database-specific**:

**PostgreSQL**: Mature support, manual refresh, CONCURRENT option.

**Oracle**: Most advanced — query rewrite (optimizer can use MV automatically), incremental refresh, fast refresh on commit.

**SQL Server**: "Indexed views" — similar concept, automatically maintained.

**MySQL**: No native materialized views. Workarounds: regular tables refreshed by jobs, or use events to update.

**Snowflake/BigQuery**: Native, automatic incremental refresh.

**Use cases**:

**1. Dashboards / Reports**:
- "Total revenue this month" — expensive aggregate
- Materialize, refresh hourly
- Dashboard loads instantly

**2. Search optimization**:
- Pre-join multiple tables
- Pre-compute relevance scores
- Refresh nightly

**3. Replication for read-heavy workloads**:
- Pre-compute hot queries on replica
- Reduces load on primary

**4. Aggregations for analytics**:
- Daily/weekly/monthly summaries
- OLAP cubes precomputed
- Star schema fact-table aggregates

**5. Caching expensive joins**:
- Multi-table joins materialized
- Avoid recomputing every query

**Trade-offs**:

**Pros**:
- Fast query performance (often 100-1000x faster)
- Reduces load on underlying tables
- Simple to query (just like a regular table)

**Cons**:
- Storage cost (stores duplicate data)
- Staleness (data lag between refreshes)
- Refresh time (large views take long)
- Coordination (which queries should use it?)

**Indexing materialized views**:
- Yes, you can create indexes on them
- Often the whole point — fast lookups on aggregated data
- \`CREATE INDEX ON monthly_sales (month)\`

**Common patterns**:

**Pattern 1: Reporting layer**:
- Operational tables (normalized)
- Materialized views (denormalized aggregates)
- Reports query the views — fast and simple SQL

**Pattern 2: Search index**:
- Combine multiple tables into searchable view
- Index full-text search columns
- Refresh nightly when data changes infrequently

**Pattern 3: Cached expensive query**:
- Identify slow query in production
- Materialize it; refresh periodically
- App now reads from MV instead of running query

## Real-World Example
**E-commerce dashboard**: 
- "Top 10 products by revenue this week"
- Underlying query: scan 10M order_items, JOIN products, GROUP BY, SUM, ORDER BY, LIMIT 10 — takes 5 seconds
- Materialize as \`top_products_weekly\`, refresh hourly
- Dashboard loads in 50ms instead of 5 seconds

**Analytics platform**:
- Multiple materialized views for different aggregation levels (daily, weekly, monthly)
- Refreshed at appropriate times
- Reports pick the right MV based on date range

**Stack Overflow-style sites**:
- "Top users this month" — expensive
- Pre-computed in MV
- Refreshed daily

## Interview Tips
- Materialized = stored results; regular view = stored query
- Refresh strategies: manual, scheduled, concurrent, incremental
- Storage vs freshness trade-off
- Indexing materialized views is often the point

## Common Follow-up Questions
1. View vs materialized view? (Stored query vs stored results)
2. How do you keep MV fresh? (Refresh strategies — manual, scheduled, trigger-based, automatic incremental)
3. Why not just cache in app? (MV in DB benefits all clients, supports indexing, transactional with data)`,

    'Database Audit Logging': `## Definition
**Database audit logging** is the practice of recording who did what, when, and how to a database — for security, compliance, troubleshooting, and accountability. Audit logs typically capture queries, data modifications, login events, and permission changes.

## Why It Matters
Audit logs are required by regulations (GDPR, HIPAA, SOX, PCI-DSS), critical for security forensics, and invaluable for debugging "who changed this data?" mysteries. Every production database needs some form of auditing.

## Detailed Explanation

**What to audit**:

**1. Authentication events**:
- Logins (successful and failed)
- Password changes
- Privilege escalations

**2. Data modifications**:
- INSERT, UPDATE, DELETE — who, what, when, before/after values
- Schema changes (DDL)
- Specific sensitive tables (audit "users", "permissions")

**3. Queries**:
- All SELECT (very high volume) — usually too much
- SELECT on sensitive data
- Slow queries
- Failed queries

**4. Admin actions**:
- User management
- Permission grants/revokes
- Configuration changes
- Backups, restores

**Audit logging approaches**:

**1. Application-level audit**:
- App writes audit records to a log table
- Custom logic — flexible
- Risk: bypassed by direct DB access, manual SQL

\`\`\`sql
INSERT INTO audit_log (user_id, action, table_name, record_id, before, after, timestamp)
VALUES (?, 'UPDATE', 'orders', 123, ?, ?, NOW());
\`\`\`

**2. Database triggers**:
- Triggers fire on INSERT/UPDATE/DELETE
- Write to audit table automatically
- Pros: can't bypass
- Cons: performance overhead, complexity

\`\`\`sql
CREATE TRIGGER audit_users
AFTER UPDATE ON users
FOR EACH ROW
INSERT INTO users_audit (user_id, old_email, new_email, changed_at, changed_by)
VALUES (NEW.id, OLD.email, NEW.email, NOW(), CURRENT_USER);
\`\`\`

**3. Database native auditing**:
- Built-in features (PostgreSQL pgaudit, Oracle Audit Vault, SQL Server Audit)
- Comprehensive
- Performance impact varies

**PostgreSQL pgaudit**:
\`\`\`sql
SET pgaudit.log = 'WRITE, DDL';
\`\`\`
Logs all writes and DDL to standard PostgreSQL log.

**MySQL Enterprise Audit**:
- Plugin captures all queries
- Logs to file or table

**4. Change Data Capture (CDC)**:
- Tools like Debezium read DB transaction log (WAL/binlog)
- Stream changes to Kafka/elsewhere
- Comprehensive without performance hit on DB
- Enables many use cases beyond audit

**5. Network-level capture**:
- Database firewalls (Imperva, custom proxies)
- Sees all queries between app and DB
- Can capture even direct admin access

**Audit log schema**:

\`\`\`sql
CREATE TABLE audit_log (
  id BIGSERIAL PRIMARY KEY,
  timestamp TIMESTAMP DEFAULT NOW(),
  user_id INT,
  username VARCHAR(100),
  action VARCHAR(20),
  table_name VARCHAR(100),
  record_id INT,
  old_values JSONB,
  new_values JSONB,
  ip_address INET,
  application VARCHAR(100),
  success BOOLEAN
);
\`\`\`

JSONB columns capture before/after states flexibly.

**Best practices**:

**1. Append-only**:
- Audit logs should never be updated or deleted
- Immutable record
- Use database constraints or separate write-once storage

**2. Separate storage**:
- Don't store audit logs in the same DB as audited data
- Compromise of main DB shouldn't lose evidence
- Centralized log storage (ELK, Splunk, dedicated audit DB)

**3. Performance considerations**:
- Audit triggers add overhead per write
- Async writes (queue + worker) reduce impact
- Batch inserts for high-volume

**4. Retention policies**:
- Compliance requires N years (SOX: 7 years, HIPAA: 6 years)
- Old logs archived to cheap storage
- Don't delete prematurely

**5. Searchable**:
- Index on common queries (timestamp, user, table)
- Time-series partitioning for huge logs
- Specialized log search (Elasticsearch)

**6. Privacy considerations**:
- Don't log sensitive data unnecessarily (passwords NEVER, PII carefully)
- Hash or redact where possible
- Audit logs themselves may need protection (GDPR right to erasure)

**Common compliance requirements**:

**GDPR**:
- Track access to personal data
- Right-to-be-forgotten — delete data + audit access
- Breach notification — knowing who accessed what

**HIPAA** (US healthcare):
- All access to protected health information (PHI)
- Who, what, when, why
- 6-year retention

**SOX** (US financial):
- Financial data changes
- Internal controls
- 7-year retention

**PCI-DSS** (credit cards):
- All access to cardholder data
- 1-year retention minimum

**Common challenges**:

**1. Audit log volume**:
- Busy systems generate massive logs
- Storage and search costs add up
- Selective auditing (only sensitive tables)

**2. Query performance**:
- Triggers slow writes
- Trade-off: completeness vs performance

**3. Audit log integrity**:
- Logs themselves can be tampered
- Cryptographic chains, blockchain-like structures
- Append-only file systems, WORM storage

**4. Forensic queries**:
- "Show all access to user X's data" — need indexes and good schema
- Plan for investigation queries upfront

## Real-World Example
**Healthcare app** (HIPAA):
- Every patient record access logged
- Who viewed, when, why (clinical role)
- Audit logs reviewed regularly
- Anomaly detection: doctor accessed patient they don't treat → investigation

**Financial trading**:
- Every trade, modification logged immutably
- Regulators audit trades from years ago
- Append-only storage with cryptographic integrity

**SaaS application**:
- Customer data changes logged
- Customers can see audit trail in their account
- Internal admin actions doubly logged
- "Who deleted my user?" — answerable from logs

**Database compromise investigation**:
- Audit logs on separate system
- Show timeline of attacker actions
- Critical for incident response and notification requirements

## Interview Tips
- Know the methods: app, triggers, native, CDC, network
- Compliance drives many requirements (GDPR, HIPAA, SOX, PCI)
- Append-only and separate storage are best practices
- Volume and performance are key concerns

## Common Follow-up Questions
1. Where to store audit logs? (Separate DB, dedicated log service, never in same DB as audited data)
2. How to ensure audit log integrity? (Append-only, cryptographic hashes, separate access control)
3. Performance impact of audit triggers? (Significant — measure carefully; consider async/CDC alternatives)`,

    'Database Backup Strategies': `## Definition
**Database backup strategies** are the systematic approaches to creating recoverable copies of database data — including the types of backups (full, incremental, differential), schedules, storage locations, and recovery procedures. The strategy must balance backup frequency, storage costs, and recovery time objectives.

## Why It Matters
Backups are your last line of defense against data loss — hardware failure, ransomware, accidental DROP TABLE, corruption. A bad backup strategy is discovered only during a disaster. Real-world data loss has bankrupted companies; good backups have saved many.

## Detailed Explanation

**Types of backups**:

**1. Full backup**:
- Complete copy of entire database
- Largest size, longest backup time
- Simplest to restore
- Foundation for other types

**2. Incremental backup**:
- Only changes since last backup (any type)
- Smallest, fastest to take
- Restoration: full + every incremental in order
- Long restore chain if many incrementals

**3. Differential backup**:
- All changes since last FULL backup
- Larger than incremental, smaller than full
- Restoration: just full + latest differential
- Compromise between full and incremental

**4. Continuous / WAL backup**:
- Stream Write-Ahead Log (transaction log) to backup storage
- Allows point-in-time recovery (PITR)
- Combine with periodic full backups
- Most modern enterprise approach

**Comparison**:

| Type | Size | Backup Time | Restore Time | Restore Complexity |
|------|------|-------------|--------------|-------------------|
| Full | Largest | Longest | Fastest | Simplest |
| Differential | Medium | Medium | Medium | Moderate |
| Incremental | Smallest | Fastest | Slowest | Most complex |
| Continuous (WAL) | N/A | Streaming | Fast | Moderate |

**RTO and RPO** — key metrics:

**RTO (Recovery Time Objective)**: How quickly must you recover? E.g., 1 hour.

**RPO (Recovery Point Objective)**: How much data can you lose? E.g., 5 minutes.

These drive your strategy. Strict RPO → continuous backup + replication. Strict RTO → standby replicas, automated failover.

**Common strategies**:

**1. Daily full + hourly incremental**:
- Standard for many systems
- Daily full at low-traffic time
- Hourly incrementals throughout the day
- Restore = last full + all incrementals up to point

**2. Weekly full + daily differential + WAL**:
- For larger databases where daily full is too slow
- Weekly full Sunday
- Daily diff Monday-Saturday
- Continuous WAL for fine-grained PITR

**3. Continuous + streaming replicas**:
- High-end production
- Replica continuously updated
- Failover in seconds
- Backups taken from replica (no impact on primary)

**4. Snapshot-based**:
- Use storage system snapshots (LVM, ZFS, EBS, RDS)
- Near-instant backup
- Often used in cloud environments
- Recovery: clone snapshot, replay WAL

**Database-specific**:

**PostgreSQL**:
- \`pg_dump\` — logical backup (SQL or custom format)
- \`pg_basebackup\` — physical backup
- WAL archiving for PITR
- Continuous archiving with tools like pgBackRest, Barman

**MySQL**:
- \`mysqldump\` — logical
- \`mysqlbackup\` (Enterprise) — physical
- XtraBackup (Percona) — open-source physical hot backup
- Binlog for PITR

**Oracle/SQL Server**: Built-in advanced backup tools (RMAN, native backup).

**Cloud databases**:
- AWS RDS automated daily backups + 5-min log shipping
- Configurable retention (1-35 days)
- Snapshot capability
- Cross-region replication

**Storage best practices**:

**3-2-1 rule**:
- **3** copies of data
- On **2** different media types
- **1** off-site

Examples:
- Production DB + local backup + S3 cross-region
- Hot copy + tape + offline cloud

**Off-site / off-account**:
- Same region/account = same disaster (region outage, account compromise)
- AWS: cross-account, cross-region replication
- Critical for ransomware: attacker shouldn't be able to delete backups

**Encryption**:
- Backups contain all your data — encrypt at rest
- Encrypt in transit during backup transfer
- Manage keys carefully (don't lose keys with the data)

**Compression**:
- Reduces storage and transfer
- Trade-off: backup/restore speed
- Most backup tools support it

**Testing backups**:

**The cardinal rule: an untested backup is no backup**.

- Regular restore drills (monthly minimum)
- Test in isolated environment
- Verify data integrity after restore
- Time the recovery — does it meet RTO?

**Common failure modes**:
- Backups silently failed for months
- Restore takes 10x longer than expected
- Backups corrupted (storage failure)
- Encryption keys lost
- Backups deleted by ransomware (had write access)

**Real disaster scenarios**:

**1. Hardware failure**: Disk crashes — restore from yesterday's backup, lose at most 24 hours.

**2. Accidental deletion**: \`DROP TABLE users\` in production. Restore + replay WAL up to just before the DROP. PITR is critical here.

**3. Data corruption (silent)**: Bad data written days ago. Need backups going back far enough to find clean version.

**4. Ransomware**: All accessible data encrypted. Off-site / immutable backups are the lifesaver.

**5. Region outage**: Cloud region down. Cross-region replicas / backups for failover.

**Application-level**:

**Logical (pg_dump, mysqldump)**:
- Outputs SQL or structured data
- Portable across versions
- Slower for large DBs
- Can restore individual tables

**Physical (file-level)**:
- Copies data files directly
- Faster for large DBs
- Less portable
- All-or-nothing restore

## Real-World Example
**E-commerce site (production)**:
- AWS RDS automatic backups: daily snapshot, 5-minute log retention, 30-day window
- Cross-region replica for disaster recovery
- Manual snapshots before major migrations
- Test restore quarterly

**Banking core systems**:
- Continuous transaction log shipping
- Synchronous replication to standby (zero data loss)
- Daily backups to tape archive (regulatory compliance, 7-year retention)
- Multi-region active-active for some services

**SaaS startup**:
- Managed Postgres with automatic backups
- Daily logical backups to S3 (separate account)
- Test restore monthly in staging
- Documented runbook for recovery

**Famous failure: GitLab 2017**:
- Engineer accidentally deleted production DB
- Five backup methods all failed for various reasons
- Last working backup was 6 hours old
- Detailed public postmortem highlighted importance of testing

## Interview Tips
- 3-2-1 rule is gold-standard advice
- RTO and RPO drive strategy
- Untested backups don't count
- Continuous + replicas for stricter requirements

## Common Follow-up Questions
1. Full vs incremental vs differential? (Size and restore complexity trade-offs)
2. What's PITR? (Point-in-time recovery — restore to exact moment using WAL/binlog)
3. Why off-site backups? (Same region/account susceptible to same disaster)`
  },

  'Networks': {
    'OSI Model': `## Definition
The **OSI (Open Systems Interconnection) Model** is a conceptual framework that standardizes the functions of a telecommunication or computing system into seven abstract layers. Each layer serves the layer above it and is served by the layer below it.

## Why It Matters
The OSI model is foundational networking knowledge. While real-world networks use TCP/IP (4-5 layers), interviewers and textbooks reference OSI's 7 layers to describe what each part of a networking stack does.

## Detailed Explanation

**The 7 Layers** (top to bottom):

**7. Application Layer**:
- User-facing protocols
- HTTP, FTP, SMTP, DNS, SSH
- The actual data your application sends/receives

**6. Presentation Layer**:
- Data formatting, encryption, compression
- TLS/SSL traditionally here (though TLS spans multiple layers)
- Character encoding (ASCII, Unicode), JSON/XML

**5. Session Layer**:
- Session management — open, maintain, close connections
- Authentication, authorization
- Often merged with application/transport in practice

**4. Transport Layer**:
- End-to-end delivery, error correction
- TCP (reliable, ordered), UDP (fast, unreliable)
- Port numbers
- Flow control, congestion control

**3. Network Layer**:
- Routing between networks
- IP (IPv4, IPv6) addressing
- Routers operate here
- ICMP (ping)

**2. Data Link Layer**:
- Frame delivery on local network
- MAC addresses
- Ethernet, Wi-Fi (802.11), PPP
- Switches operate here

**1. Physical Layer**:
- Bits over wires/radio
- Cables, hubs, repeaters
- Voltage levels, frequencies, physical media

**Mnemonic**: "Please Do Not Throw Sausage Pizza Away" (Physical → Application).

**Encapsulation**:

When data goes down the stack:
- Application: HTTP request
- Transport: + TCP header (port, sequence)
- Network: + IP header (source, dest IP)
- Data Link: + Ethernet header (MAC addresses)
- Physical: bits on the wire

Each layer wraps the previous in its own header (and trailer for some).

**Reverse on receive**: Each layer strips its header and passes contents up.

**OSI vs TCP/IP**:

| OSI Layer | TCP/IP Layer | Examples |
|-----------|--------------|----------|
| Application | Application | HTTP, DNS, SSH |
| Presentation | Application | TLS, encoding |
| Session | Application | Sessions |
| Transport | Transport | TCP, UDP |
| Network | Internet | IP, ICMP |
| Data Link | Link | Ethernet, Wi-Fi |
| Physical | Link | Cables, signals |

TCP/IP combines the top three OSI layers into one and the bottom two into one, giving 4-5 practical layers.

**Where things actually happen**:

| Component | Layer |
|-----------|-------|
| Application code | 7 |
| TLS encryption | 6 |
| Web browser session | 5 |
| TCP socket | 4 |
| IP routing | 3 |
| Switch / Wi-Fi AP | 2 |
| Cable / radio | 1 |

**Why layered design**:

**1. Modularity**: Change one layer without affecting others (e.g., switch from Wi-Fi to Ethernet — only Layer 1-2 changes).

**2. Standardization**: Different vendors interoperate (your iPhone talks to a Cisco router talks to Google's servers).

**3. Troubleshooting**: Isolate problems to one layer ("ping fails — Layer 3 issue").

**4. Innovation**: Develop new protocols at one layer (HTTP/2, HTTP/3 — Layer 7 changes, lower layers untouched).

## Real-World Example
**Browsing google.com**:
1. **App**: Browser sends HTTP GET request
2. **Pres**: Encrypted with TLS
3. **Session**: HTTPS session established
4. **Trans**: TCP segment with port 443
5. **Net**: IP packet to Google's IP
6. **Link**: Ethernet frame to your router's MAC
7. **Phys**: Electrical signals over cable

Reverse process at Google's server.

**Diagnosing failures**:
- Can't reach any website? Check Layer 1 (cable plugged in?), Layer 2 (Wi-Fi connected?)
- Specific site unreachable? Layer 3 (routing) or Layer 4 (firewall blocking port)
- Site loads but breaks? Layer 7 (app issue)

## Interview Tips
- Memorize the 7 layers in order
- Know what device operates at which layer (switch L2, router L3)
- TCP/IP is more commonly used in practice
- Encapsulation concept is key

## Common Follow-up Questions
1. What's the difference between TCP/IP and OSI? (TCP/IP has 4-5 layers, more practical)
2. Where does TLS sit? (Technically Presentation/6, but practically between Transport and Application)
3. Switch vs Router? (L2 forwards by MAC; L3 routes by IP)`,

    'TCP vs UDP': `## Definition
**TCP (Transmission Control Protocol)** provides reliable, ordered, error-checked delivery of data over a network. **UDP (User Datagram Protocol)** offers faster, simpler, connectionless delivery without reliability guarantees. TCP prioritizes correctness; UDP prioritizes speed and simplicity.

## Why It Matters
The choice between TCP and UDP fundamentally affects application performance and behavior. Understanding when to use each is essential for network programming and system design.

## Detailed Explanation

**TCP characteristics**:
- **Connection-oriented**: 3-way handshake before data
- **Reliable**: Acknowledges delivery, retransmits lost packets
- **Ordered**: Packets reassembled in send order
- **Flow control**: Receiver can slow down sender
- **Congestion control**: Detects network congestion, backs off
- **Error checking**: Checksums detect corruption
- **Heavyweight**: More overhead per byte

**UDP characteristics**:
- **Connectionless**: Just send packets, no setup
- **Unreliable**: No acknowledgments, no retransmission
- **Unordered**: Packets may arrive in any order
- **No flow/congestion control**: Sends as fast as you tell it
- **Error checking**: Optional checksum
- **Lightweight**: Minimal overhead

**Comparison**:

| Aspect | TCP | UDP |
|--------|-----|-----|
| Connection | Required | None |
| Reliability | Guaranteed | None |
| Ordering | Maintained | Not guaranteed |
| Speed | Slower | Faster |
| Header size | 20+ bytes | 8 bytes |
| Use case | Files, web, email | Streaming, gaming, DNS |
| Examples | HTTP, FTP, SSH | DNS, DHCP, video calls |

**TCP 3-way handshake**:
1. Client → SYN → Server
2. Server → SYN-ACK → Client
3. Client → ACK → Server
Connection established. Data flows.

**TCP teardown** (4-way):
1. Either side: FIN
2. Other side: ACK
3. Other side: FIN
4. Original side: ACK

**TCP reliability mechanisms**:
- **Sequence numbers**: Each byte numbered; receiver detects gaps
- **Acknowledgments (ACKs)**: Receiver confirms received bytes
- **Retransmission**: If ACK not received in time, resend
- **Sliding window**: Multiple packets in flight without waiting for each ACK

**TCP congestion control**:
- **Slow start**: Begin slow, double rate each RTT
- **Congestion avoidance**: Increase linearly past threshold
- **Fast retransmit**: 3 duplicate ACKs = packet lost, resend immediately
- **Algorithms**: Reno, Cubic (Linux default), BBR (modern)

**When to use TCP**:
- Web (HTTP/HTTPS) — full page must arrive
- File transfers (FTP) — every byte matters
- Email (SMTP) — message integrity critical
- SSH — commands must be in order
- Database connections — transactions matter
- Anything where loss is unacceptable

**When to use UDP**:
- DNS lookups — small queries, retry at app level
- DHCP — bootstrapping the network
- Video/audio streaming — better to skip late frames than wait
- Online gaming — latest position matters more than every position
- VoIP — same reason
- Multicast/broadcast — TCP is point-to-point only

**Modern hybrid: QUIC (HTTP/3)**:
- Built on UDP
- Adds reliability, ordering at app layer
- Avoids TCP head-of-line blocking
- Used by HTTP/3, Google services
- Faster than TCP for many web scenarios

**TCP head-of-line blocking**:
- One lost packet blocks all subsequent packets until retransmit
- Bad for HTTP/2 (multiple streams over one TCP connection)
- QUIC fixes this with independent streams over UDP

**UDP advantages in practice**:
- **Latency**: No connection setup, no ACKs
- **Predictability**: No congestion control surprises
- **Multicast**: Send to many receivers simultaneously
- **Simplicity**: Just send and forget

**UDP disadvantages**:
- **Lossy**: Packets can vanish
- **No flow control**: Can overwhelm slow receivers
- **NAT/firewall issues**: Stateless, harder to traverse
- **Not always allowed**: Some networks block UDP

**Application-level reliability**:

UDP-based protocols often add reliability where needed:
- DNS retries on timeout
- Video uses forward error correction
- Games use sequence numbers, prediction
- QUIC adds full reliability over UDP

## Real-World Example
**Watching YouTube** (HLS over HTTPS): Uses TCP via HTTP. Reliability matters; slight buffering acceptable.

**Live game streaming**: UDP. Frame loss acceptable to maintain low latency. Better to drop a frame than show last second's frame now.

**Online FPS game**: UDP. Player position updates 60 times per second. Last update is best; lost update doesn't matter (next one arrives in 16ms).

**DNS query**: UDP. Tiny query and response (a few hundred bytes). Retry at app level if needed.

**Video conferencing (Zoom, etc.)**: Hybrid — UDP for media, TCP for chat/control.

**Web (HTTP/2)**: TCP. Need reliable, ordered delivery of HTML, CSS, JS.

**Web (HTTP/3)**: QUIC over UDP. Solves HTTP/2's head-of-line blocking.

## Interview Tips
- TCP = reliable, slower; UDP = fast, unreliable
- Memorize 3-way handshake
- Application examples for each
- Mention QUIC/HTTP/3 as modern relevant point

## Common Follow-up Questions
1. Why does video use UDP if loss is bad? (Latency matters more than perfection — old data is useless)
2. Can you make UDP reliable? (Yes — QUIC, custom protocols add reliability at app layer)
3. What's TCP head-of-line blocking? (One lost packet blocks all behind it on same connection)`,

    'HTTP vs HTTPS': `## Definition
**HTTP (HyperText Transfer Protocol)** is the foundational protocol of the web — it transmits hypertext requests and responses between clients and servers in plaintext. **HTTPS (HTTP Secure)** is HTTP encrypted via TLS (Transport Layer Security), providing confidentiality, integrity, and authentication.

## Why It Matters
HTTPS is now the standard for the web — browsers warn on HTTP, and SEO favors HTTPS. Understanding the difference is essential for any web developer.

## Detailed Explanation

**HTTP basics**:
- Plain text protocol over TCP (port 80)
- Stateless — each request independent
- Request/response model: GET, POST, PUT, DELETE, etc.
- Headers + body
- Anyone on the network can read messages

**HTTPS**:
- HTTP wrapped in TLS encryption (port 443)
- All content encrypted in transit
- Server authenticated via certificate
- Optionally, client authenticated (mTLS)

**What HTTPS provides**:

**1. Confidentiality**: Eavesdropper can't read content. Encryption uses symmetric keys derived from the TLS handshake.

**2. Integrity**: Tampering detected. Each message has authentication tag (HMAC or AEAD).

**3. Authentication**: Server proves identity via certificate signed by trusted Certificate Authority (CA).

**TLS handshake** (simplified, TLS 1.3):
1. Client → ClientHello (supported versions, ciphers)
2. Server → ServerHello + Certificate + key exchange
3. Both compute shared secret
4. Encrypted communication begins

**TLS 1.3 improvements**:
- 1-RTT handshake (faster)
- 0-RTT for resumed sessions (extremely fast)
- Removed weak/legacy ciphers
- Forward secrecy by default

**Certificate basics**:
- Server has a public/private key pair
- Public key is in a certificate
- Certificate signed by Certificate Authority (CA) like Let's Encrypt, DigiCert
- Browser trusts CA → trusts server's certificate
- Certificate proves: "yes, this is really google.com"

**Browser certificate validation**:
- Is certificate signed by trusted CA?
- Is certificate valid for this domain?
- Is certificate not expired or revoked?
- Does the chain validate?

If any check fails: scary warning, often blocked.

**Comparison**:

| Aspect | HTTP | HTTPS |
|--------|------|-------|
| Port | 80 | 443 |
| Encryption | None | TLS |
| Performance | Slightly faster | Slightly slower (handshake) |
| URL prefix | http:// | https:// |
| Trust | None | Browser shows lock |
| SEO | Penalized | Boosted |
| Modern web | Deprecated | Required |

**Costs of HTTPS**:

**1. Latency**: TLS handshake adds 1-2 round trips. TLS 1.3 reduces this.

**2. CPU**: Encryption costs CPU. Modern servers and AES-NI hardware make this negligible.

**3. Certificate cost**: Used to be $50-500/year. Let's Encrypt made it free.

**Worth it for**: All but the most performance-critical scenarios. Cost savings from modern protocols (HTTP/2, HTTP/3) and offloading SSL termination to load balancers offset costs.

**HTTP/HTTPS in practice**:

**Mixed content**:
- HTTPS page loading HTTP resources (image, script) — browser blocks (mixed content warning)
- All resources should be HTTPS

**HSTS (HTTP Strict Transport Security)**:
- Server header tells browser "always use HTTPS for this domain"
- Browser remembers, refuses HTTP
- Prevents downgrade attacks

**Certificate Transparency**:
- Public log of all certificates
- Detects rogue/misissued certificates
- Browsers require this

**Common attacks HTTPS prevents**:
- **Eavesdropping**: Wi-Fi sniffing, ISP monitoring
- **Tampering**: Injecting ads, malicious code (some ISPs do this on HTTP)
- **Impersonation**: Fake servers (without HTTPS, no proof of identity)

**Common HTTPS issues**:

**1. Expired certificate**: Browser shows error. Set up auto-renewal (Let's Encrypt + certbot).

**2. Self-signed certificates**: Not trusted by browsers. OK for development, breaks for users.

**3. Wrong certificate**: e.g., cert for example.com served for example.org. Specific to domain.

**4. Weak ciphers**: Old TLS versions deprecated (1.0, 1.1). Use TLS 1.2+ only.

**HTTP versions**:

**HTTP/1.1**: Text protocol, persistent connections, pipelining (rarely used)

**HTTP/2**: Binary protocol, multiplexing, server push, header compression. Built on TCP.

**HTTP/3**: Same features as HTTP/2 but on QUIC (UDP-based). Better for unreliable networks.

**HTTPS is required** for HTTP/2 and HTTP/3 in browsers.

## Real-World Example
**Logging into your bank**:
- Without HTTPS: anyone on Wi-Fi sees your password
- With HTTPS: encrypted; even ISP can't read it
- Certificate proves it's actually your bank, not phishing site

**Public Wi-Fi at a coffee shop**:
- HTTP: anyone with a laptop and Wireshark sees your traffic
- HTTPS: encrypted; safe even on hostile networks

**E-commerce checkout**:
- Mandatory HTTPS — credit card data, addresses
- PCI-DSS requires it

**Modern web requirements**:
- Browsers (Chrome, Firefox) mark HTTP as "Not Secure"
- Search engines (Google) rank HTTPS higher
- Service Workers, geolocation, etc., require HTTPS

## Interview Tips
- HTTPS = HTTP + TLS
- Three pillars: confidentiality, integrity, authentication
- Mention TLS 1.3, Let's Encrypt as modern context
- HSTS prevents downgrade

## Common Follow-up Questions
1. How does TLS handshake work? (Client/server hello, key exchange, derive shared secret)
2. What's a certificate? (Public key + identity, signed by CA)
3. Why is HSTS important? (Prevents browser from accepting HTTP version of site)`,

    'IP Addressing': `## Definition
**IP (Internet Protocol) addressing** is the system for identifying devices on a network. **IPv4** uses 32-bit addresses (e.g., 192.168.1.1) — about 4.3 billion possible. **IPv6** uses 128-bit addresses (e.g., 2001:0db8:85a3::8a2e:0370:7334) — practically unlimited.

## Why It Matters
IP addresses are the backbone of internet communication. Understanding them is essential for networking, debugging, and system architecture.

## Detailed Explanation

**IPv4 structure**:
- 32 bits, written as 4 octets (8 bits each)
- Example: \`192.168.1.1\`
- Each octet 0-255
- Total addresses: 2^32 ≈ 4.3 billion

**IPv4 classes** (historical, mostly obsolete with CIDR):
- **Class A**: 0.x.x.x to 127.x.x.x (large networks)
- **Class B**: 128.0.x.x to 191.255.x.x (medium)
- **Class C**: 192.0.0.x to 223.255.255.x (small)
- **Class D**: 224-239 (multicast)
- **Class E**: 240-255 (reserved)

Modern systems use CIDR (Classless Inter-Domain Routing):
- \`192.168.1.0/24\` — first 24 bits are network, last 8 are host
- \`/24\` = 256 addresses; \`/16\` = 65,536; \`/8\` = 16M
- Smaller mask = larger network

**Public vs Private IPs**:

**Private (RFC 1918)**:
- 10.0.0.0/8 (16M addresses)
- 172.16.0.0/12 (1M addresses)
- 192.168.0.0/16 (65K addresses)
- Used in home/office networks
- Not routable on the internet

**Public**: Routable on internet. Need ISP allocation.

**Special addresses**:
- \`127.0.0.1\` — localhost (loopback)
- \`0.0.0.0\` — "any address" / "this network"
- \`255.255.255.255\` — broadcast
- \`169.254.x.x\` — link-local (auto-assigned when no DHCP)

**Subnetting example**:
\`192.168.1.0/24\`:
- Network: 192.168.1.0
- Broadcast: 192.168.1.255
- Hosts: 192.168.1.1 - 192.168.1.254 (254 usable)

**NAT (Network Address Translation)**:
- Many private IPs share one public IP
- Router translates between them
- Solves IPv4 exhaustion
- Complicates incoming connections (port forwarding needed)

**IPv4 exhaustion**:
- 4.3 billion addresses, allocated long ago
- Today: workarounds (NAT, IPv6)
- ARIN ran out in 2015

**IPv6**:
- 128-bit addresses
- 8 groups of 16 bits, hex
- Example: \`2001:0db8:85a3:0000:0000:8a2e:0370:7334\`
- Shortened: \`2001:db8:85a3::8a2e:370:7334\` (\`::\` = consecutive zeros)

**IPv6 advantages**:
- Vast address space (2^128 ≈ 3.4 × 10^38)
- No NAT needed (every device has public IP)
- Better routing (aggregation)
- IPSec built-in
- Improved auto-configuration

**IPv6 special addresses**:
- \`::1\` — localhost
- \`::\` — unspecified (any)
- \`fe80::/10\` — link-local
- \`fc00::/7\` — unique local (private)
- \`2000::/3\` — global unicast (public)

**IPv4/IPv6 coexistence**:
- Dual-stack: machines run both
- Tunneling: IPv6 packets in IPv4 (transition mechanism)
- NAT64: IPv6-only network reaches IPv4 internet

**IPv6 adoption**:
- Slow but growing
- Major sites (Google, Facebook) support both
- Mobile networks pushing IPv6
- Eventually IPv4 will be deprecated

**MAC addresses**:
- 48-bit hardware addresses (Layer 2)
- Format: \`AA:BB:CC:DD:EE:FF\`
- Permanent (mostly) per network interface
- Local-only (don't traverse routers)

**IP vs MAC**:
- IP: logical, routed across internet
- MAC: physical, local network only
- ARP maps IP to MAC for delivery

**Subnet mask and CIDR notation**:
- \`/24\` = 255.255.255.0 (24 ones, 8 zeros)
- \`/16\` = 255.255.0.0
- More ones = smaller network = more networks

## Real-World Example
**Home network**: 
- ISP gives you one public IP (say 73.45.12.100)
- Your router has both public IP and private (192.168.1.1)
- Your devices: 192.168.1.x
- Router NAT-translates: outgoing requests appear from 73.45.12.100

**Cloud VPC (AWS, GCP, Azure)**:
- Define private CIDR (e.g., 10.0.0.0/16)
- Subnets within (10.0.1.0/24 for app, 10.0.2.0/24 for DB)
- Public-facing services have public IP
- Private services keep private IPs

**IPv6 in practice**: Visit \`https://test-ipv6.com/\` — checks if your connection supports IPv6.

## Interview Tips
- Know IPv4 ranges and CIDR notation
- Private IP ranges (10/8, 172.16/12, 192.168/16)
- IPv6 has 128 bits — vastly larger
- NAT is the workaround for IPv4 exhaustion

## Common Follow-up Questions
1. What's NAT? (Network Address Translation — many private IPs share one public)
2. What's CIDR? (Classless routing — flexible network sizing via prefix length)
3. Why is IPv6 adoption slow? (Huge install base, NAT works, transition complex)`,

    'DNS': `## Definition
**DNS (Domain Name System)** is the internet's phonebook — it translates human-readable domain names (like google.com) into IP addresses (like 142.251.46.142). DNS is a distributed, hierarchical system that runs on UDP/TCP port 53.

## Why It Matters
Every internet activity depends on DNS — websites, email, APIs, gaming. Understanding DNS explains many "internet is broken" issues and is essential for system design.

## Detailed Explanation

**Why DNS exists**:
- Humans remember names, computers use IPs
- IPs change (servers move); names stay stable
- One name can map to multiple IPs (load balancing)

**DNS hierarchy**:
\`\`\`
.            (root, "dot")
├── com      (TLD - Top Level Domain)
│   ├── google.com
│   │   ├── www.google.com
│   │   └── mail.google.com
│   ├── facebook.com
│   └── ...
├── org
├── io
├── uk
└── ...
\`\`\`

**Top-Level Domains (TLDs)**:
- **gTLDs**: .com, .org, .net, .info, etc.
- **ccTLDs**: .uk, .de, .jp (country codes)
- **New gTLDs**: .app, .dev, .io, etc.

**DNS resolution process** (simplified):

User types \`www.example.com\`:

1. **Browser cache**: Already known? Done.
2. **OS cache**: Already known? Done.
3. **Resolver (ISP/Google 8.8.8.8/CloudFlare 1.1.1.1)**: Caches answers.
4. If resolver doesn't know:
   - **Root server**: "Ask the .com server: 192.x.x.x"
   - **TLD server (.com)**: "Ask example.com's server: 198.x.x.x"
   - **Authoritative server (example.com)**: "www.example.com is at 93.184.216.34"
5. Resolver caches answer (with TTL)
6. Returns to OS → browser
7. Browser connects to 93.184.216.34

**DNS record types**:

| Type | Purpose | Example |
|------|---------|---------|
| A | IPv4 address | example.com → 93.184.216.34 |
| AAAA | IPv6 address | example.com → 2606:2800::1 |
| CNAME | Alias | www.example.com → example.com |
| MX | Mail server | example.com → mail.example.com (priority 10) |
| TXT | Arbitrary text | SPF, DKIM, verification |
| NS | Name server | example.com → ns1.example.com |
| SOA | Zone authority | Primary NS, admin email |
| PTR | Reverse DNS | IP → name |
| SRV | Service location | _xmpp._tcp |
| CAA | Cert authority | Specifies who can issue certs |

**TTL (Time-To-Live)**:
- How long resolvers cache the record
- Lower TTL = faster propagation but more queries
- Common: 300s (5 min), 3600s (1 hour), 86400s (1 day)
- Lower TTL before known DNS changes

**DNS over UDP vs TCP**:
- UDP for normal queries (small, fast)
- TCP for large responses (>512 bytes) or zone transfers
- DNS over HTTPS (DoH) and DNS over TLS (DoT) — encrypted DNS

**Public DNS resolvers**:
- Google: 8.8.8.8, 8.8.4.4
- Cloudflare: 1.1.1.1, 1.0.0.1 (privacy-focused)
- OpenDNS, Quad9
- ISP-provided (often slower or filtered)

**DNS for performance and reliability**:

**1. Multiple A records**: 
\`\`\`
example.com → 1.2.3.4
example.com → 5.6.7.8
\`\`\`
Round-robin or geo-routing across IPs.

**2. Geographic DNS (GeoDNS)**:
- Different answers based on user location
- US users get US servers; EU users get EU
- Implemented via GeoIP at DNS server

**3. Anycast**:
- Same IP on multiple geographic locations
- BGP routes to nearest
- Used by 8.8.8.8, 1.1.1.1, CDNs

**4. Failover**:
- Health checks
- Remove unhealthy IPs from rotation

**Common DNS tools**:

\`\`\`bash
nslookup example.com
dig example.com           # more detail
dig +trace example.com    # full resolution path
host example.com          # simpler
\`\`\`

**DNS caching layers**:
1. Browser cache
2. OS cache (e.g., \`systemd-resolved\` on Linux)
3. Router cache
4. ISP resolver cache
5. CDN edge cache
6. Authoritative server (no cache, source of truth)

**Each layer respects TTL**, so changes propagate gradually.

**DNS issues**:

**1. Stale cache**: Old IP cached, can't reach new server. Wait for TTL or flush cache.

**2. Misconfigured records**: Typo in NS records — site unreachable globally for hours.

**3. DNS poisoning**: Malicious actor injects fake responses. Mitigation: DNSSEC.

**4. DDoS on DNS**: Attacks on DNS providers (Dyn, 2016) take down many sites. Mitigation: redundancy, anycast.

**DNSSEC**:
- DNS Security Extensions
- Cryptographically signs DNS responses
- Prevents spoofing
- Limited adoption — complex to deploy

**Reverse DNS (PTR records)**:
- IP → name
- Important for email (anti-spam)
- Used by logging, monitoring

## Real-World Example
**Visiting youtube.com**:
1. Browser asks OS for youtube.com IP
2. OS asks resolver (e.g., 8.8.8.8)
3. Resolver: cached? Yes → return immediately
4. Cache miss → walk hierarchy: root → .com → youtube.com
5. youtube.com authoritative says: "Geographic — you're in India? Use 142.251.42.78"
6. Browser connects

**CDN setup**:
- example.com CNAME → cdn.cloudflare.com
- cdn.cloudflare.com is anycast
- User reaches nearest CloudFlare edge
- Edge serves cached content or fetches from origin

**Email setup**:
- MX records direct mail to mail server
- SPF record (TXT) authorizes who can send
- DKIM (TXT) signs outgoing mail
- DMARC (TXT) policy on what to do with failures

**Famous outage — 2016 Dyn DDoS**:
- Major DNS provider Dyn DDoSed
- Sites using Dyn DNS unreachable: Twitter, Netflix, Reddit, GitHub
- Internet "broken" for hours
- Lesson: DNS is a critical dependency

## Interview Tips
- Know the resolution flow (cache → resolver → root → TLD → authoritative)
- Common record types (A, AAAA, CNAME, MX, TXT)
- TTL controls cache duration
- DNS is hierarchical and distributed

## Common Follow-up Questions
1. CNAME vs A record? (CNAME points to another name; A points to IP)
2. Why does DNS use UDP? (Fast, simple; small responses fit in one packet)
3. What's DNS poisoning? (Injecting fake responses; mitigated by DNSSEC)`,

    'TCP 3-Way Handshake': `## Definition
The **TCP 3-way handshake** is the procedure by which a TCP client and server establish a connection before exchanging data. It synchronizes sequence numbers and confirms both parties are ready to communicate. The three steps are SYN, SYN-ACK, and ACK.

## Why It Matters
The handshake is fundamental to every TCP connection — every web request, every API call. Understanding it explains connection costs, latency, and how connection-related issues manifest.

## Detailed Explanation

**The three steps**:

**Step 1: SYN (Synchronize)**:
- Client → Server: "I want to talk. My initial sequence number is X."
- TCP flag: SYN
- Random initial sequence number (ISN) for security

**Step 2: SYN-ACK (Synchronize-Acknowledge)**:
- Server → Client: "Got your request. My ISN is Y. I acknowledge X+1."
- Flags: SYN + ACK
- Server's own random ISN

**Step 3: ACK (Acknowledge)**:
- Client → Server: "Got your response. I acknowledge Y+1."
- Flag: ACK
- Connection is now established; data can flow

**Visual**:
\`\`\`
Client                        Server
  │                              │
  │── SYN (seq=X) ──────────────▶│
  │                              │
  │◀── SYN-ACK (seq=Y, ack=X+1) ─│
  │                              │
  │── ACK (ack=Y+1) ────────────▶│
  │                              │
  │═════ DATA TRANSFER ═════════│
\`\`\`

**Why three steps**:

**Two would be insufficient**:
- Only client SYN + server SYN-ACK
- Server doesn't know if client got the SYN-ACK
- Could waste resources on broken connection

**Three is the minimum** for both sides to confirm:
- Client confirms its messages reach server (server replied)
- Server confirms its messages reach client (client's final ACK)

**Sequence numbers**:
- Each TCP byte numbered with 32-bit sequence number
- ACK number = next expected byte (e.g., ACK=X+1 means "got everything up to X")
- ISN randomized to prevent attacks (predictable ISN was old vulnerability)

**Connection states**:

| State | Description |
|-------|-------------|
| LISTEN | Server waiting for connection |
| SYN-SENT | Client sent SYN |
| SYN-RECEIVED | Server got SYN, sent SYN-ACK |
| ESTABLISHED | Connection ready for data |

**Time cost — 1 RTT for handshake**:
- Round-trip time (RTT) = time for one round-trip (e.g., 50ms US to EU)
- Handshake = 1.5 RTT to be precise (SYN, SYN-ACK, ACK)
- Before data transfer can begin

**For HTTPS, add TLS handshake** on top:
- TLS 1.2: 2 RTT (or 1 with session resumption)
- TLS 1.3: 1 RTT (or 0 with 0-RTT)
- Total: TCP + TLS = 2-3 RTT before data

**Connection teardown — 4-way handshake**:

\`\`\`
Client                        Server
  │── FIN ──────────────────────▶│
  │◀── ACK ─────────────────────│
  │                              │
  │◀── FIN ─────────────────────│
  │── ACK ──────────────────────▶│
\`\`\`

Either side can initiate close. Both directions closed independently.

**Common TCP issues related to handshakes**:

**1. SYN flood attack**:
- Attacker sends many SYNs without ACKs
- Server holds half-open connections, exhausts memory
- Defense: SYN cookies (server doesn't keep state until ACK arrives)

**2. Connection refused**:
- Server doesn't have anything listening on that port
- Server replies with RST instead of SYN-ACK
- "Connection refused" error

**3. Connection timeout**:
- SYN sent, no SYN-ACK
- Eventually times out (~30-60 seconds default)
- Server unreachable, firewalled, or down

**4. RST (reset)**:
- Abrupt connection termination
- Sent on protocol violation, port closed, etc.
- Different from FIN (graceful)

**TCP Fast Open (TFO)**:
- Allows data in initial SYN
- Skips first RTT
- Requires cookie from previous connection
- Limited adoption

**HTTP performance impact**:

**Single connection lifecycle**:
- TCP handshake: 1 RTT
- TLS handshake: 1-2 RTT
- HTTP request/response: 1 RTT
- Total: 3-4 RTT for first request

**Optimizations**:
- **Keep-alive**: Reuse connection for multiple requests (HTTP/1.1 default)
- **HTTP/2**: One connection, many streams
- **HTTP/3 (QUIC)**: 0 or 1 RTT including TLS

## Real-World Example
**Loading a web page**:
1. DNS lookup for site (~20ms)
2. TCP handshake (~50ms)
3. TLS handshake (~50ms with TLS 1.3, more with older)
4. HTTP request (~50ms)
5. Server processes, returns response (~100ms)
6. Page renders, fetches more resources

If RTT is 100ms: ~300ms before first byte. Significant for users in distant locations.

**API calls in mobile apps**: Each API call requires a fresh handshake if connection isn't kept alive. Slow networks (cellular) = noticeable delay.

**SYN flood mitigation**: SYN cookies invented at Bell Labs to defeat early SYN flood attacks. Now standard in Linux kernel.

**Performance optimization**:
- Connection pooling (databases, HTTP)
- HTTP/2 multiplexing
- Persistent connections
- CDN edge nearer to user (lower RTT)

## Interview Tips
- Memorize the three steps (SYN, SYN-ACK, ACK)
- Know why three is necessary (mutual confirmation)
- Mention TLS adds more RTTs
- SYN flood is a classic security topic

## Common Follow-up Questions
1. Why three steps and not two? (Both sides must confirm receipt)
2. How does the connection close? (4-way: FIN/ACK/FIN/ACK, both directions independent)
3. What's a SYN flood? (DDoS via many half-open connections; defense: SYN cookies)`,

    'HTTP Methods': `## Definition
**HTTP methods** (also called verbs) indicate the desired action to be performed on a resource. The most common are GET, POST, PUT, DELETE, PATCH, HEAD, and OPTIONS. Each has specific semantics regarding safety, idempotency, and caching.

## Why It Matters
HTTP methods are the foundation of REST API design. Using them correctly produces clear, predictable APIs. Misusing them (e.g., GET that modifies data) breaks caches, browsers' back button, and conventions.

## Detailed Explanation

**Common HTTP methods**:

**GET**: Retrieve a resource.
- Safe (no side effects)
- Idempotent (multiple identical requests have same effect)
- Cacheable
- Body usually not allowed in request

**POST**: Create a new resource or trigger an action.
- Not safe (creates/modifies)
- Not idempotent (each POST creates new resource)
- Generally not cacheable
- Body contains the resource

**PUT**: Replace a resource at a specific URL.
- Not safe
- Idempotent (same PUT multiple times = same final state)
- Body contains complete resource

**DELETE**: Remove a resource.
- Not safe
- Idempotent (deleting twice = same end state)
- Generally no body

**PATCH**: Partially update a resource.
- Not safe
- May or may not be idempotent (depends on the patch)
- Body contains the changes

**HEAD**: Same as GET but only headers, no body.
- Safe, idempotent, cacheable
- Used to check if resource exists, get size, etc.

**OPTIONS**: Discover what methods are supported.
- Safe, idempotent
- Used in CORS preflight requests

**Other methods**:
- **CONNECT**: Establish tunnel (used by HTTPS proxies)
- **TRACE**: Echo request for debugging (often disabled)

**Properties summary**:

| Method | Safe | Idempotent | Cacheable | Has Body |
|--------|------|------------|-----------|----------|
| GET | Yes | Yes | Yes | No |
| POST | No | No | No | Yes |
| PUT | No | Yes | No | Yes |
| DELETE | No | Yes | No | No |
| PATCH | No | Sometimes | No | Yes |
| HEAD | Yes | Yes | Yes | No |
| OPTIONS | Yes | Yes | No | No |

**Definitions**:

**Safe**: Doesn't modify state. GET, HEAD, OPTIONS are safe.

**Idempotent**: Multiple identical calls have the same effect as one. PUT, DELETE are idempotent. POST is not (each creates new).

**Cacheable**: Response can be cached for future requests. GET, HEAD primarily; others rarely.

**REST API design conventions**:

| Method + URL | Action |
|--------------|--------|
| GET /users | List all users |
| GET /users/123 | Get user 123 |
| POST /users | Create new user |
| PUT /users/123 | Replace user 123 entirely |
| PATCH /users/123 | Update some fields of user 123 |
| DELETE /users/123 | Delete user 123 |

**PUT vs POST for creation**:
- **POST /users**: Server assigns ID; returns 201 Created with location
- **PUT /users/specific-id**: Client provides ID; replaces if exists

**PUT vs PATCH**:
- **PUT**: Send entire resource; what's not sent is removed
- **PATCH**: Send only changes; rest stays the same

\`\`\`
PUT /users/123 with body {name: "Alice"}
→ User 123 now has only {name: "Alice"} (other fields cleared)

PATCH /users/123 with body {name: "Alice"}
→ User 123 has updated name, other fields unchanged
\`\`\`

**Common mistakes**:

**1. GET with side effects**:
- "GET /delete-user?id=123" — terrible idea
- Web crawlers, prefetching, browser back button all break things
- Use DELETE or POST

**2. POST for everything**:
- Some APIs use POST for all operations
- Loses semantic meaning, caching, idempotency benefits
- Hard to reason about

**3. Wrong status codes**:
- GET that returns 200 with "error" body — should be 404 or 4xx
- POST that returns 200 — should be 201 (Created) or 204 (No Content)

**Status codes by method**:

**GET**:
- 200 OK with body
- 304 Not Modified (cached version still valid)
- 404 Not Found

**POST**:
- 201 Created (with Location header)
- 200 OK (action successful, no new resource)
- 204 No Content

**PUT**:
- 200 OK (replaced)
- 201 Created (if didn't exist)
- 204 No Content

**DELETE**:
- 204 No Content (deleted)
- 404 Not Found
- 200 OK (with deleted resource info)

**Idempotency in practice**:

**Why it matters**:
- Network glitch causes retry
- Idempotent: safe to retry
- Non-idempotent: might double-charge a credit card

**Idempotency keys** (for non-idempotent operations like POST):
- Client sends a unique key per "logical operation"
- Server tracks keys; ignores duplicates
- Used by Stripe, payment systems

**Status codes — ranges**:
- **1xx**: Informational
- **2xx**: Success
- **3xx**: Redirection
- **4xx**: Client error
- **5xx**: Server error

## Real-World Example
**Twitter API**:
- GET /tweets/123 — fetch a tweet
- POST /tweets — post a new tweet
- DELETE /tweets/123 — delete it
- PATCH /tweets/123 — edit it

**E-commerce**:
- POST /orders — create order (not idempotent — could create duplicates if retried; use idempotency key)
- GET /orders/abc — fetch order
- PUT /orders/abc/status — update status

**File upload (S3)**:
- PUT /bucket/key — upload file (idempotent — same upload twice, same result)
- GET /bucket/key — download
- DELETE /bucket/key — remove

**HEAD use case**: Before downloading a large file, HEAD to check Content-Length and Last-Modified — decide if download is needed.

## Interview Tips
- Memorize properties table (safe, idempotent, cacheable)
- Know REST conventions (GET list, POST create, etc.)
- PUT vs PATCH is a common interview question
- Idempotency keys for non-idempotent operations

## Common Follow-up Questions
1. PUT vs POST for creation? (PUT: client knows URL. POST: server assigns.)
2. PUT vs PATCH? (PUT: full replacement. PATCH: partial update.)
3. Why is idempotency important? (Safe retries on network errors)`,

    'HTTP Status Codes': `## Definition
**HTTP status codes** are 3-digit codes returned by servers indicating the result of a request. They're grouped into 5 classes by the first digit: 1xx (informational), 2xx (success), 3xx (redirect), 4xx (client error), 5xx (server error).

## Why It Matters
Status codes are the universal language of HTTP. Using the right code at the right time is essential for proper API behavior, error handling, caching, monitoring, and SEO.

## Detailed Explanation

**Class breakdown**:

**1xx — Informational**:
- 100 Continue: Server accepted headers; client should send body
- 101 Switching Protocols: e.g., upgrading to WebSocket

Rarely seen by application code.

**2xx — Success**:
- **200 OK**: Standard success
- **201 Created**: Resource created (e.g., POST that creates)
- **202 Accepted**: Async — request accepted, processing later
- **204 No Content**: Success but no body (e.g., DELETE)
- **206 Partial Content**: Range request fulfilled (downloads, video streaming)

**3xx — Redirection**:
- **301 Moved Permanently**: New URL forever; update bookmarks
- **302 Found**: Temporary redirect (was "Moved Temporarily")
- **304 Not Modified**: Client's cached version still valid; no body
- **307 Temporary Redirect**: Like 302 but preserves method
- **308 Permanent Redirect**: Like 301 but preserves method

**4xx — Client Error**:
- **400 Bad Request**: Malformed request (invalid JSON, etc.)
- **401 Unauthorized**: Auth required (poorly named — should be "Unauthenticated")
- **403 Forbidden**: Authenticated but lacks permission
- **404 Not Found**: Resource doesn't exist
- **405 Method Not Allowed**: Method not supported on this URL
- **408 Request Timeout**: Client took too long to send
- **409 Conflict**: State conflict (e.g., duplicate entry)
- **410 Gone**: Resource permanently removed
- **413 Payload Too Large**: Body exceeds limit
- **415 Unsupported Media Type**: Wrong content type
- **422 Unprocessable Entity**: Valid format but semantic errors
- **429 Too Many Requests**: Rate limited

**5xx — Server Error**:
- **500 Internal Server Error**: Generic catch-all
- **501 Not Implemented**: Server doesn't support method
- **502 Bad Gateway**: Upstream server error
- **503 Service Unavailable**: Server overloaded or maintenance
- **504 Gateway Timeout**: Upstream took too long

**401 vs 403** — common confusion:
- **401**: "I don't know who you are. Authenticate."
- **403**: "I know who you are. You don't have permission."

**301 vs 302**:
- **301**: Permanent. Browsers/crawlers update references.
- **302**: Temporary. May come back to original.
- For SEO: use 301 for permanent moves.

**307 vs 308 vs 301/302**:
- 301/302: Method may change (POST → GET)
- 307/308: Method preserved
- Modern best practice: prefer 307/308 for clarity.

**Common patterns**:

**Successful operations**:
- GET → 200 with data
- POST that creates → 201 with Location header
- PUT/PATCH → 200 with updated resource OR 204 No Content
- DELETE → 204 No Content

**Failed validation**:
- 400 Bad Request: Couldn't parse
- 422 Unprocessable Entity: Could parse, but values invalid
- Some APIs use 400 for both (simpler, less debate)

**Authorization errors**:
- 401 if no/invalid auth
- 403 if authenticated but lacks permission
- Some sites use 404 instead of 403 to hide existence (security through obscurity)

**Rate limiting**:
- 429 with Retry-After header indicating when to retry
- API best practice

**Transient errors**:
- 503 Service Unavailable: Try again later (with Retry-After)
- 502 Bad Gateway: Upstream issue (often temporary)
- Caller can retry these

**Permanent errors**:
- 4xx: Don't retry (won't change)
- 410 Gone: Don't even try this URL again
- Caller should fix or stop

**Headers with status codes**:

**Location** (with 201, 3xx):
- Where to find the resource
- For 201: URL of newly created
- For 3xx: where to redirect

**Retry-After** (with 503, 429):
- Seconds to wait or HTTP date
- Tells caller when to retry

**WWW-Authenticate** (with 401):
- Tells client what auth scheme to use

**Cache-Control** (with all responses):
- How and how long to cache

**Browser behavior**:

**3xx redirects**: Browser follows automatically (up to limit).

**4xx**: Browser displays response body.

**5xx**: Browser displays response body but treats as error.

**304**: Browser uses cached version, no body in response.

**API design considerations**:

**1. Use specific codes**:
- 404 vs 410 — both "not here", but 410 says "and won't be back"
- 409 vs 422 — both client errors, 409 specifically for conflicts

**2. Don't lie**:
- Returning 200 with "error" in body is BAD
- Caches will cache the "error"
- Monitoring won't catch it

**3. Be consistent**:
- Same error type → same status
- Document your status codes

**4. Don't expose internal details**:
- 500 errors shouldn't include stack traces in production
- Generic message; log details internally

## Real-World Example
**Login API**:
- 200 + token if successful
- 401 if wrong credentials (caller should reauth)
- 429 if too many attempts (rate limited)
- 500 if database is down

**File upload**:
- 201 + Location if created
- 413 if too large
- 415 if wrong type
- 507 Insufficient Storage if disk full

**Page redirect**:
- Old URL: 301 to new URL
- Browsers update bookmarks; search engines update rankings

**Stripe API**:
- Detailed status codes for every situation
- 402 Payment Required for declined card
- 429 with detailed retry headers
- Documented thoroughly

## Interview Tips
- Memorize common codes (200, 201, 301, 302, 304, 400, 401, 403, 404, 500, 502, 503)
- Know 401 vs 403
- Know 301 vs 302
- Use specific codes when possible

## Common Follow-up Questions
1. 401 vs 403? (Not authenticated vs authenticated but no permission)
2. 301 vs 302? (Permanent vs temporary redirect)
3. 502 vs 503 vs 504? (502: bad upstream response. 503: server overloaded. 504: upstream timeout.)`,

    'REST API': `## Definition
**REST (Representational State Transfer)** is an architectural style for designing networked applications. RESTful APIs use HTTP methods (GET, POST, PUT, DELETE) on resources identified by URLs, exchanging representations (often JSON). REST is stateless and follows several constraints designed to make APIs scalable and uniform.

## Why It Matters
REST is the dominant style for web APIs — almost every modern application interacts with REST APIs. Understanding REST principles is essential for any backend developer.

## Detailed Explanation

**Core REST principles**:

**1. Client-Server**:
- Separation of concerns
- Clients don't know server internals
- Servers don't know client internals
- Both can evolve independently

**2. Stateless**:
- Each request contains all info needed
- Server doesn't remember previous requests
- Enables horizontal scaling
- Auth tokens sent with each request

**3. Cacheable**:
- Responses indicate cacheability
- Clients/intermediaries cache appropriately
- Improves performance

**4. Uniform Interface** (the most defining):
- Resources identified by URLs (\`/users/123\`)
- Resources manipulated via representations (JSON)
- Self-descriptive messages (Content-Type, etc.)
- HATEOAS (links between resources)

**5. Layered System**:
- Client doesn't know if it's talking to actual server or proxy
- Allows load balancers, CDNs, gateways

**6. Code on Demand** (optional):
- Server can send code (e.g., JavaScript) to extend client

**Resources and URLs**:

REST is resource-centric. URLs identify resources; methods say what to do.

| URL | Resource |
|-----|----------|
| /users | Collection of users |
| /users/123 | Specific user |
| /users/123/orders | User 123's orders |
| /users/123/orders/456 | Order 456 belonging to user 123 |

**HTTP methods on resources**:

| Method + URL | Action |
|--------------|--------|
| GET /users | List users |
| GET /users/123 | Get user 123 |
| POST /users | Create new user |
| PUT /users/123 | Replace user 123 |
| PATCH /users/123 | Update fields of user 123 |
| DELETE /users/123 | Delete user 123 |

**Naming conventions**:

- **Plurals for collections**: \`/users\` not \`/user\`
- **Nouns, not verbs**: \`/users\` not \`/getUsers\`
- **Hyphens or camelCase**: \`/user-profiles\` or \`/userProfiles\` (be consistent)
- **Lowercase**: Generally preferred
- **No trailing slash** (or always trailing — be consistent)
- **Hierarchical**: \`/companies/abc/employees/123\`

**Filtering, sorting, pagination via query params**:

\`\`\`
GET /users?status=active&sort=created_at&order=desc&page=2&limit=20
\`\`\`

**HATEOAS (Hypermedia as the Engine of Application State)**:

Responses include links to related actions:

\`\`\`json
{
  "id": 123,
  "name": "Alice",
  "_links": {
    "self": {"href": "/users/123"},
    "orders": {"href": "/users/123/orders"},
    "delete": {"href": "/users/123"}
  }
}
\`\`\`

In theory: clients discover capabilities. In practice: rarely fully implemented.

**JSON conventions**:

- camelCase or snake_case (be consistent)
- ISO 8601 dates: "2024-01-15T10:30:00Z"
- Numeric IDs vs UUIDs vs strings
- Errors structured consistently

**Standard error response**:
\`\`\`json
{
  "error": {
    "code": "INVALID_INPUT",
    "message": "Email is required",
    "field": "email"
  }
}
\`\`\`

**Versioning**:

**1. URL versioning**: \`/api/v1/users\` — explicit, easy
**2. Header versioning**: \`Accept: application/vnd.example.v1+json\`
**3. Query param**: \`/users?version=1\`

URL versioning is most common. Header versioning is more "RESTful" but less convenient.

**Authentication patterns**:

- **Bearer tokens**: \`Authorization: Bearer <token>\` (most common)
- **API keys**: \`X-API-Key: <key>\`
- **OAuth**: Token-based with scopes
- **Basic auth**: Username/password (over HTTPS only)

**Pagination**:

**Offset-based**:
\`\`\`
GET /users?offset=20&limit=10
\`\`\`
- Easy to implement
- Bad for changing data (skips/duplicates)

**Cursor-based**:
\`\`\`
GET /users?cursor=abc&limit=10
\`\`\`
- Stable across changes
- Harder to jump to specific page

**REST limitations**:

**1. Over/under-fetching**:
- GET /users/123 returns all fields
- App might need only name → over-fetching
- Or might need user + orders → multiple requests (under-fetching)
- GraphQL solves this (different paradigm)

**2. Multiple round trips**:
- Want user + orders + items: 3+ requests
- Mitigated by sub-resources (\`/users/123/orders\`) or eager loading

**3. Limited methods**:
- 7 main methods vs unbounded operations needed
- Some APIs add custom verbs: \`POST /users/123/activate\`

**4. Real-time updates**:
- REST is request/response
- Real-time needs WebSockets, Server-Sent Events, or polling

**REST vs alternatives**:

**vs SOAP**: REST is simpler, lighter; SOAP has more enterprise features (WS-Security, transactions).

**vs GraphQL**: REST has multiple endpoints; GraphQL has one with flexible queries. REST simpler; GraphQL more flexible for clients.

**vs gRPC**: REST is text-based JSON; gRPC is binary, faster, schema-defined.

**RESTful maturity (Richardson Maturity Model)**:
- Level 0: SOAP-like, one endpoint
- Level 1: Resources (URLs)
- Level 2: HTTP verbs and status codes (most "REST" APIs)
- Level 3: HATEOAS (rarely achieved)

## Real-World Example
**Twitter API** (REST):
- GET /tweets/123
- POST /tweets
- DELETE /tweets/123
- GET /users/elon/tweets

**Stripe API** (excellent REST):
- POST /v1/charges to create
- GET /v1/charges/ch_123 to retrieve
- POST /v1/charges/ch_123/capture to capture
- Returns clean JSON, well-structured errors
- Documented exhaustively

**GitHub API**:
- GET /users/octocat
- GET /repos/octocat/hello-world
- POST /repos/octocat/hello-world/issues
- Hypermedia-rich (HATEOAS-style links)

**Common API design pattern**:
\`\`\`
GET /api/v1/users?page=1&limit=20
GET /api/v1/users/123
POST /api/v1/users
PUT /api/v1/users/123
DELETE /api/v1/users/123
GET /api/v1/users/123/orders
\`\`\`

## Interview Tips
- Six REST constraints (be ready to discuss client-server, stateless, cacheable, etc.)
- Methods on resources, not actions in URLs
- Status codes matter
- Stateless = scalable

## Common Follow-up Questions
1. What does "stateless" mean? (Server doesn't remember previous requests; each request self-contained)
2. PUT vs POST for create? (PUT: client knows URL. POST: server assigns.)
3. REST vs GraphQL? (Multiple endpoints with fixed shape vs one endpoint with flexible queries)`,

    'Cookies vs Sessions': `## Definition
**Cookies** are small pieces of data stored on the client (browser), sent with every request to a particular site. **Sessions** are server-side state about a user, typically referenced by a session ID stored in a cookie. Cookies are the storage mechanism; sessions are a usage pattern that often relies on cookies.

## Why It Matters
Web applications need to remember users across requests (HTTP is stateless). Cookies and sessions are the foundational mechanisms for this — every authentication system, shopping cart, and personalization feature depends on them.

## Detailed Explanation

**Cookies**:
- Set by server via \`Set-Cookie\` header
- Stored in browser
- Sent automatically with every request to that domain
- Have attributes: expiry, scope, security flags

**Cookie example**:
\`\`\`
Set-Cookie: session_id=abc123; Domain=example.com; Path=/; Max-Age=3600; Secure; HttpOnly; SameSite=Strict
\`\`\`

**Cookie attributes**:

**Domain**: Which sites can see this cookie. \`example.com\` includes subdomains.

**Path**: Which URL paths. \`/api\` only sent for /api/* requests.

**Max-Age / Expires**: When cookie expires. Without these, "session cookie" deleted on browser close.

**Secure**: Only sent over HTTPS. Always set this.

**HttpOnly**: Not accessible to JavaScript. Prevents XSS theft. Always set for auth cookies.

**SameSite**:
- **Strict**: Only sent with same-site requests. Strongest CSRF protection.
- **Lax**: Sent with safe (GET) cross-site navigation. Default in modern browsers.
- **None**: Sent always (must combine with Secure). For cross-site embeds.

**Cookie types by usage**:

**1. Session cookies**: No expiry, deleted on browser close. Used for short-term state.

**2. Persistent cookies**: Have explicit expiry. Used for "remember me" features.

**3. First-party cookies**: Set by the site you're visiting.

**4. Third-party cookies**: Set by other domains (e.g., ads, analytics). Increasingly blocked by browsers.

**Sessions** — server-side state:

**Server-side session storage**:
\`\`\`
session_id (cookie) → server stores: { user_id: 123, role: 'admin', cart: [...] }
\`\`\`

The cookie just holds an ID; actual data on server.

**Session storage options**:
- **In-memory**: Simple, lost on restart, doesn't scale
- **Database**: Persistent, scales, slightly slow
- **Redis/Memcached**: Fast, common choice
- **JWT**: Self-contained tokens (stateless, no server storage)

**Sessions vs Cookies — confusing terminology**:

People often say "sessions" to mean different things:
1. Server-side session state (the original meaning)
2. Just session cookies (no server state, all in cookie)
3. The whole user authentication system

Be precise about what's meant.

**Comparison**:

| Aspect | Plain Cookies | Server Sessions |
|--------|---------------|-----------------|
| Storage | Client | Server |
| Size limit | ~4 KB per cookie | Server's choice |
| Sent each request | Yes (full content) | Just session ID |
| Tampering risk | High (client controlled) | Low (server controlled) |
| Sensitive data | Bad idea | OK |
| Scalability | Easy (no server state) | Need shared session store |

**Authentication flow with sessions**:

1. User logs in: POST /login with username/password
2. Server validates, creates session: \`session_id = "abc"\`, stores \`{user: 123}\` in Redis
3. Server sends back cookie: \`Set-Cookie: session_id=abc; HttpOnly; Secure; SameSite=Lax\`
4. Browser sends cookie with subsequent requests
5. Server looks up \`abc\` in Redis, gets user info
6. Server processes request as authenticated user

**Logout**:
- Delete session from server
- Send Set-Cookie with empty value or expired

**JWT alternative** (stateless):

JWT (JSON Web Token) is a signed token containing all user info. No server-side session storage.

\`\`\`
Header.Payload.Signature
{"alg":"HS256"}.{"user":123,"exp":1234567890}.signature
\`\`\`

Stored in cookie or localStorage. Server verifies signature, no DB lookup.

**Pros**: Stateless, scales easily, no session store.
**Cons**: Hard to revoke, larger size, more complex security.

**Cookies for non-auth uses**:

- **Preferences**: theme, language
- **Analytics**: tracking IDs
- **Cart contents**: small carts client-side
- **A/B test groups**

**Security considerations**:

**1. XSS protection**: HttpOnly cookies. JavaScript can't read them, so XSS can't steal them.

**2. CSRF protection**: SameSite cookies + CSRF tokens.

**3. Session hijacking**: Use HTTPS (Secure flag). Rotate session IDs on login.

**4. Cookie tampering**: Sign cookies (e.g., HMAC) so server detects modification.

**Modern browser changes**:

**Third-party cookie phase-out**: Chrome, Safari, Firefox restricting third-party cookies. Affects ads, analytics, embedded widgets.

**SameSite=Lax default**: Cookies without SameSite attribute treated as Lax (was None). Better security default.

**Privacy enhancements**: ITP (Safari) limits cookie lifetime for tracking.

**Cookie limits**:
- ~4 KB per cookie
- ~50-180 cookies per domain (browser-dependent)
- Total cookie storage limit per domain

**Localstorage / SessionStorage** — alternatives:

Modern web storage APIs:
- **localStorage**: Persists indefinitely, ~5 MB
- **sessionStorage**: Per-tab, cleared on close
- Larger than cookies
- Not sent with requests automatically
- Accessible to JavaScript (no HttpOnly)

Better for: large client-side data, app state.
Worse for: auth (XSS risk).

## Real-World Example
**E-commerce login**:
1. Login form POST → server validates
2. Server creates session in Redis: \`{user_id: 42, cart: []}\`
3. Set-Cookie: session_id=xyz; HttpOnly; Secure; SameSite=Lax
4. User browses; cart updates stored in Redis session
5. User checks out; server has full cart from session
6. Logout: delete Redis entry, expire cookie

**Shopping cart for guest users**:
- Cart in cookie (small) or localStorage
- On signup/login: merge with server-side cart
- Pattern handles both authenticated and guest users

**Tracking pixel**:
- Image with cookie set by ad network
- Visits to other sites with same network: cookie identifies user
- Privacy laws (GDPR, CCPA) require consent
- Modern browsers block this

**SaaS application**:
- Cookie holds session ID
- Server session in Redis (scalable)
- "Remember me" extends cookie expiry to 30 days
- Logout deletes server session AND clears cookie

## Interview Tips
- Cookies = client storage; Sessions = server-side state, often using cookies
- HttpOnly + Secure + SameSite = security baseline
- Mention JWT as stateless alternative
- Modern cookie restrictions are interesting context

## Common Follow-up Questions
1. Cookies vs sessions difference? (Cookie: client storage. Session: server state, often referenced by cookie.)
2. JWT vs sessions? (JWT: stateless, signed. Sessions: server-side, easy to revoke.)
3. Why HttpOnly? (Prevents JavaScript access, mitigates XSS impact)`,

    'JWT': `## Definition
**JWT (JSON Web Token, pronounced "jot")** is a compact, URL-safe token format for transmitting claims between parties as a JSON object. It's digitally signed (and optionally encrypted) so the receiver can verify integrity. Commonly used for authentication and information exchange in web APIs.

## Why It Matters
JWTs are the dominant token format for modern APIs. They enable stateless authentication, microservices communication, and OAuth 2.0 implementations. Understanding JWTs is essential for backend security work.

## Detailed Explanation

**JWT structure**:

Three Base64URL-encoded parts separated by dots:

\`\`\`
xxxxx.yyyyy.zzzzz
header.payload.signature
\`\`\`

**Header** (JSON, Base64-encoded):
\`\`\`json
{
  "alg": "HS256",
  "typ": "JWT"
}
\`\`\`

**Payload** (claims):
\`\`\`json
{
  "sub": "1234567890",
  "name": "Alice",
  "role": "admin",
  "iat": 1516239022,
  "exp": 1516242622
}
\`\`\`

**Signature**:
\`\`\`
HMACSHA256(
  base64UrlEncode(header) + "." + base64UrlEncode(payload),
  secret
)
\`\`\`

**Standard claims** (registered):
- **iss** (issuer): Who issued the token
- **sub** (subject): Who the token is about (e.g., user ID)
- **aud** (audience): Who token is for
- **exp** (expiration time): Unix timestamp
- **nbf** (not before): Token not valid before this time
- **iat** (issued at): When token was created
- **jti** (JWT ID): Unique identifier for revocation

**Custom claims**: Anything else (\`role\`, \`email\`, \`tenant_id\`, etc.).

**Signing algorithms**:

**Symmetric (HMAC)**: Same secret to sign and verify.
- HS256, HS384, HS512
- Fast, simple
- Both parties need the secret
- Risk if shared between many services

**Asymmetric (RSA, ECDSA)**: Private key signs, public key verifies.
- RS256, RS384, RS512 (RSA)
- ES256, ES384, ES512 (ECDSA)
- Auth server has private; resource servers have public
- Better for distributed systems

**None algorithm**: \`{"alg": "none"}\` — no signature. **NEVER use** — historic vulnerabilities.

**JWT vs Sessions**:

| Aspect | Sessions | JWT |
|--------|----------|-----|
| Storage | Server (Redis, DB) | Client only |
| Server state | Required | None |
| Scaling | Need shared session store | Trivial |
| Revocation | Easy (delete from store) | Hard (token still valid until expiry) |
| Size | Small (just session ID) | Larger (full payload) |
| Tampering | N/A (server-stored) | Detected via signature |

**Authentication flow with JWT**:

1. User logs in: POST /login with credentials
2. Server validates, creates JWT containing user info
3. Server signs JWT, returns to client
4. Client stores JWT (cookie, localStorage, header)
5. Subsequent requests: \`Authorization: Bearer <jwt>\`
6. Server verifies signature; if valid, trusts payload (no DB lookup needed)

**Where to store JWT** (security-sensitive choice):

**1. HttpOnly Cookie**:
- Pros: Not accessible to JavaScript (XSS-safe)
- Cons: Vulnerable to CSRF (mitigated with SameSite)

**2. localStorage**:
- Pros: Easy to use; not sent automatically (no CSRF)
- Cons: Vulnerable to XSS (any script can read)

**3. Memory only** (variable):
- Pros: Most secure (gone on tab close)
- Cons: Lost on refresh

**4. Authorization header**:
- Sent explicitly with each request
- Combined with localStorage or memory
- Common for SPAs

**Best practice**: Cookie with HttpOnly + Secure + SameSite=Strict for web; Authorization header for mobile/native.

**JWT pros**:

**1. Stateless**: No server-side session storage needed. Easy to scale horizontally.

**2. Cross-domain**: Easy to use across services and domains.

**3. Self-contained**: All info in token (with signature integrity).

**4. Performance**: No DB lookup per request to verify (just signature check).

**5. Standard**: RFC 7519, widely supported.

**JWT cons**:

**1. Revocation is hard**:
- Token valid until expiry
- Can't immediately invalidate (without state)
- Workarounds: short expiry + refresh tokens, blacklist (loses statelessness)

**2. Size**:
- Larger than session ID
- Sent with every request
- Adds bandwidth overhead

**3. Token theft is dangerous**:
- Attacker with token has full access until expiry
- Mitigations: short expiry, IP/UA binding (limited), refresh tokens

**4. Common implementation mistakes**:
- Using "none" algorithm
- Weak HMAC secret
- Not checking expiry
- Not validating signature properly

**Refresh token pattern**:

JWT itself is short-lived (15 min). Companion long-lived refresh token (7 days) gets new JWT.

\`\`\`
1. Login → access token (15 min) + refresh token (7 days)
2. Use access token until it expires (or close)
3. Refresh: send refresh token, get new access token
4. Logout: invalidate refresh token (DB-stored)
\`\`\`

Reduces window of attack and enables logout.

**Common JWT vulnerabilities**:

**1. Weak signing key**:
- Predictable HMAC secret → attacker forges tokens
- Use long random secrets (256+ bits)

**2. Algorithm confusion**:
- Server expects RS256, attacker sends HS256 with public key as HMAC secret
- Some libraries vulnerable historically
- Always strict-check algorithm

**3. None algorithm**:
- \`{"alg": "none"}\` → no signature
- Some libs accept this
- Reject \`alg: none\` always

**4. Not validating claims**:
- Forget to check \`exp\` → expired tokens accepted
- Forget to check \`aud\` → token meant for service A used at service B

**5. Storage mistakes**:
- Storing in localStorage + XSS = stolen token
- Always combine appropriate storage with security headers

**JWT in OAuth 2.0**:
- OAuth issues access tokens (often JWT)
- Access tokens have scopes (\`read:users\`, \`write:posts\`)
- ID tokens (in OpenID Connect) are JWTs identifying the user

## Real-World Example
**Microservices auth**:
- Auth service issues JWT signed with RS256 private key
- Each microservice has the public key
- Verify signature locally — no need to call auth service
- Massive scale enabled

**SPA + API**:
- React app calls login endpoint
- Receives JWT in HttpOnly cookie
- Subsequent API calls include cookie automatically
- API verifies JWT signature, trusts user_id claim

**Mobile app**:
- App stores JWT in secure storage (Keychain, Keystore)
- Sends in Authorization header
- Refresh token for re-authentication without password

**Common implementation pseudocode**:
\`\`\`js
// Issue
const token = jwt.sign(
  { sub: user.id, role: user.role },
  process.env.JWT_SECRET,
  { expiresIn: '15m' }
);

// Verify (middleware)
const token = req.headers.authorization?.replace('Bearer ', '');
const payload = jwt.verify(token, process.env.JWT_SECRET);
req.user = payload;
\`\`\`

## Interview Tips
- JWT structure: header.payload.signature (Base64 + HMAC/RSA)
- Stateless vs sessions trade-off
- Revocation is the main JWT challenge
- Mention refresh token pattern

## Common Follow-up Questions
1. JWT vs sessions? (Stateless, scale better; harder to revoke)
2. How to revoke a JWT? (Short expiry, blacklist, refresh token rotation)
3. Why "alg: none" is bad? (No signature — anyone can forge tokens)`,

    'OAuth': `## Definition
**OAuth 2.0** is an authorization framework that allows third-party applications to access resources on behalf of a user without sharing the user's credentials. Instead, the user grants limited access via tokens. It's the standard for "Login with Google/Facebook/GitHub" and API access delegation.

## Why It Matters
OAuth is the dominant authorization protocol for the modern web. Every "Sign in with..." button uses OAuth. Understanding it is essential for any system that integrates with external services or manages third-party access.

## Detailed Explanation

**The problem OAuth solves**:

Without OAuth: To let an app post tweets on your behalf, you'd give it your Twitter password. Bad — app sees your password, can do anything, password change requires updating all apps.

With OAuth: Twitter gives the app a token authorized for "post tweets only." Your password stays secret. You can revoke the token anytime. Tokens have limited scope.

**Roles in OAuth 2.0**:

**1. Resource Owner**: The user who owns the data.

**2. Client**: The third-party application requesting access.

**3. Authorization Server**: The service that authenticates and issues tokens (e.g., Google's auth servers).

**4. Resource Server**: The API holding the user's data (e.g., Google Drive API).

**Auth server and resource server may be same entity** (e.g., GitHub's both).

**OAuth 2.0 grant types** (flows):

**1. Authorization Code Flow** (most common, web apps):

\`\`\`
User → Click "Login with Google" → App redirects to Google
User → Logs in to Google, approves
Google → Redirects to App with authorization code
App (server) → Exchanges code for access token (server-to-server, with client_secret)
App ← Access token (and refresh token)
App → Uses access token to call Google API
\`\`\`

Why two-step (code → token):
- Code in URL (visible) but short-lived
- Token in server-to-server response (private)
- Client_secret never exposed to user's browser

**2. Authorization Code with PKCE** (mobile, SPAs):

For clients that can't keep client_secret safe:
- Adds Proof Key for Code Exchange (PKCE)
- Client generates random verifier; sends hash with auth request
- On code exchange, sends original verifier
- Prevents intercepted code from being used

Modern best practice: PKCE for ALL clients (even server-side).

**3. Client Credentials** (machine-to-machine):

App authenticates as itself, no user involved:
- Microservice A calls Microservice B
- Cron job accesses API
- No user delegation; just service auth

**4. Resource Owner Password** (DEPRECATED):

App takes user password directly. Defeats OAuth's purpose. Avoid.

**5. Implicit Flow** (DEPRECATED):

Token directly in URL fragment. Replaced by Authorization Code + PKCE.

**6. Device Code** (for limited-input devices):

TVs, IoT — show user a code, user enters on phone:
\`\`\`
TV: "Visit example.com/device, enter code XYZ123"
User: enters code on phone, approves
TV: polls auth server, gets token
\`\`\`

Used by Smart TVs, gaming consoles, CLI tools.

**Tokens in OAuth 2.0**:

**Access Token**:
- Short-lived (typically 1 hour)
- Sent with API requests: \`Authorization: Bearer <token>\`
- Often a JWT (self-contained) or opaque (lookup required)

**Refresh Token**:
- Long-lived (days to indefinite)
- Used to get new access tokens
- Never sent with API calls
- Should be stored securely

**ID Token** (OpenID Connect addition):
- JWT with user identity info
- Used for authentication (not just authorization)

**Scopes**:

Limit what the token can do:
- \`read:user\` — read user profile
- \`write:tweets\` — post tweets
- \`admin\` — full admin access

User approves specific scopes during authorization. Less is more — request minimum scopes.

**OAuth vs Authentication**:

OAuth is **authorization**, not authentication.
- "Can this app post tweets?" → OAuth
- "Who is this user?" → OpenID Connect (built on OAuth)

OAuth misused for authentication: app gets access token, calls "/me" to get user info. Works but wasn't designed for this. OpenID Connect (OIDC) solves this properly.

**OpenID Connect (OIDC)**:

Layer on top of OAuth 2.0:
- Adds ID Token (JWT with user info)
- Standard "/me" endpoint
- Discovery (\`.well-known/openid-configuration\`)
- Used by "Login with Google" etc.

**Common OAuth providers and their nuances**:

- **Google**: Standard OAuth + OIDC. Well-documented.
- **Facebook**: Mostly OAuth, some custom extensions.
- **GitHub**: OAuth, simple. No OIDC initially (now supports it).
- **Apple "Sign in with Apple"**: OIDC + privacy features (relay email).
- **Microsoft**: OAuth + Azure AD nuances.

**Security considerations**:

**1. State parameter**:
- Random value in auth request, verified in callback
- Prevents CSRF on OAuth flow

**2. PKCE**:
- Always use, even server-side
- Prevents code interception attacks

**3. Redirect URI validation**:
- Auth server checks redirect URI against registered list
- Prevent code being sent to attacker's site

**4. Limited scopes**:
- Request minimum needed
- "Principle of least privilege"

**5. Token storage**:
- Server: secure database
- Browser: HttpOnly cookies preferred
- Mobile: secure storage (Keychain, etc.)

**6. Token revocation**:
- Provide logout / revoke endpoint
- Honor user's wish to revoke access

**Common OAuth flows in practice**:

**Mobile app + Backend + Google login**:
1. App initiates OAuth flow with Google
2. Returns code to backend
3. Backend exchanges code for tokens
4. Backend issues its own session/JWT to app

**Third-party API access** (Slack, Salesforce):
1. User installs your app from marketplace
2. OAuth flow: app gets access token for user's data
3. Your app calls Slack API on behalf of user
4. User can revoke access in Slack settings

**Microservices** (client credentials):
1. Service A has client_id and client_secret
2. POST /token → access token (no user)
3. Service A calls Service B with access token
4. Service B verifies token

## Real-World Example
**"Sign in with Google" on a startup's site**:
1. User clicks button → redirected to Google
2. User chooses Google account, approves "View profile, email"
3. Google redirects back with auth code
4. Backend exchanges code for token + ID Token
5. Backend extracts email, creates account or logs in
6. User is in. No password needed for this site.

**Slack app integration**:
1. Workspace admin installs app
2. OAuth flow with workspace scopes (channels:read, chat:write)
3. App receives access token
4. App posts messages, listens for events
5. Admin can uninstall to revoke

**API rate limiting per token**:
- Each access token has its own rate limit
- Identifies the user/app for usage tracking

**Token refresh flow**:
1. App's access token expires after 1 hour
2. App detects 401 from API
3. App posts refresh token to get new access token
4. App retries original API call

## Interview Tips
- OAuth is authorization, not authentication (use OIDC for auth)
- Authorization Code + PKCE is current best practice
- Know roles: resource owner, client, auth server, resource server
- State parameter prevents CSRF on OAuth flow

## Common Follow-up Questions
1. OAuth vs OIDC? (OAuth: authorization. OIDC: built on OAuth, adds authentication.)
2. Why two-step (code → token)? (Code in URL but token in server-to-server response — keeps secret safe)
3. What's PKCE? (Cryptographic proof preventing intercepted code from being used)`,

    'CORS': `## Definition
**CORS (Cross-Origin Resource Sharing)** is a browser security mechanism that controls when a web page can make requests to a different origin (different scheme, domain, or port). Without CORS, browsers block cross-origin requests by default for security. CORS provides a way for servers to opt-in to allowing such requests.

## Why It Matters
CORS errors are one of the most common frustrations in web development. Understanding CORS is essential for building APIs consumed by web applications, especially when frontend and backend are on different domains.

## Detailed Explanation

**Same-Origin Policy (SOP)**:

The foundation of web security. Browsers prevent JavaScript on one origin from reading responses from another origin.

**Origin** = scheme + domain + port:
- \`https://example.com:443\` and \`https://api.example.com:443\` — DIFFERENT origins
- \`http://example.com\` and \`https://example.com\` — DIFFERENT (scheme)
- \`example.com:80\` and \`example.com:8080\` — DIFFERENT (port)

**Why SOP**:
- Without it, malicious site could read your bank balance via your authenticated session
- Browser sends cookies; without SOP, any site could read responses

**The problem CORS solves**:

Modern apps often have:
- Frontend at \`https://app.example.com\`
- API at \`https://api.example.com\`

Different origins → SOP blocks requests. CORS lets the API say "yes, app.example.com can call me."

**CORS basics**:

Server adds headers to indicate which origins can access the response. Browser respects these headers.

**Simple requests**:

Methods: GET, HEAD, POST.
Standard headers only.
Content-Type: text/plain, multipart/form-data, application/x-www-form-urlencoded only.

For these, browser sends the request, then checks response:
\`\`\`
Request:
GET /api/data
Origin: https://app.example.com

Response:
Access-Control-Allow-Origin: https://app.example.com
\`\`\`

If \`Access-Control-Allow-Origin\` is the request's origin (or \`*\`), JavaScript can read response. Otherwise blocked.

**Preflighted requests**:

For "non-simple" requests (POST with JSON, custom headers, PUT, DELETE), browser sends an OPTIONS request first:

\`\`\`
Preflight (OPTIONS):
OPTIONS /api/data
Origin: https://app.example.com
Access-Control-Request-Method: POST
Access-Control-Request-Headers: Content-Type, Authorization

Server response:
HTTP/1.1 204 No Content
Access-Control-Allow-Origin: https://app.example.com
Access-Control-Allow-Methods: GET, POST, PUT, DELETE
Access-Control-Allow-Headers: Content-Type, Authorization
Access-Control-Max-Age: 3600

If approved, actual request:
POST /api/data
Origin: https://app.example.com
\`\`\`

The OPTIONS asks "may I send this request?" Server says yes/no via headers.

**Important CORS headers**:

**Access-Control-Allow-Origin**:
- Specific origin: \`https://app.example.com\`
- Wildcard: \`*\` (any origin) — restrictive: can't be used with credentials
- Multiple origins: NOT directly supported (server must echo the origin)

**Access-Control-Allow-Methods**: Allowed HTTP methods.

**Access-Control-Allow-Headers**: Allowed request headers.

**Access-Control-Allow-Credentials**: \`true\` to allow cookies/auth.

**Access-Control-Max-Age**: How long to cache preflight (avoid repeating OPTIONS).

**Access-Control-Expose-Headers**: Custom response headers JS can read.

**Credentials and CORS**:

By default, cross-origin requests don't send cookies. To include them:

**Client side**:
\`\`\`js
fetch(url, { credentials: 'include' })
// or
xhr.withCredentials = true;
\`\`\`

**Server side**:
\`\`\`
Access-Control-Allow-Credentials: true
Access-Control-Allow-Origin: https://app.example.com  // CANNOT be * with credentials
\`\`\`

**Important**: \`*\` not allowed with credentials — must specify exact origin.

**Common CORS errors**:

**1. "No 'Access-Control-Allow-Origin' header"**:
- Server didn't add CORS headers
- Server returned error before CORS middleware ran

**2. "The 'Access-Control-Allow-Origin' header has a value 'X' that is not equal to the supplied origin"**:
- Origin doesn't match what server returned
- Server's whitelist doesn't include this origin

**3. "Method 'PUT' not allowed by Access-Control-Allow-Methods"**:
- Preflight didn't authorize this method

**4. "Request header 'Authorization' not allowed by Access-Control-Allow-Headers"**:
- Preflight didn't allow this header

**5. "The value of 'Access-Control-Allow-Credentials' header in the response is '' which must be 'true' when the request's credentials mode is 'include'"**:
- Sending credentials but server didn't allow them

**Configuring CORS**:

**Express.js**:
\`\`\`js
const cors = require('cors');
app.use(cors({
  origin: 'https://app.example.com',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
\`\`\`

**Spring Boot**:
\`\`\`java
@CrossOrigin(origins = "https://app.example.com", allowCredentials = "true")
@RestController
public class MyController { ... }
\`\`\`

**Nginx (proxy or API gateway)**:
\`\`\`
add_header 'Access-Control-Allow-Origin' 'https://app.example.com';
\`\`\`

**Common patterns**:

**1. Whitelist multiple origins**:
\`\`\`js
const allowedOrigins = ['https://app.example.com', 'https://admin.example.com'];
app.use(cors({
  origin: (origin, callback) => {
    if (allowedOrigins.includes(origin)) callback(null, true);
    else callback(new Error('Not allowed by CORS'));
  }
}));
\`\`\`

**2. Allow all in dev, restrict in prod**:
\`\`\`js
const corsOrigin = process.env.NODE_ENV === 'production'
  ? 'https://app.example.com'
  : '*';
\`\`\`

**3. Reflect origin (with allowlist check)**:
- Echo back the request's origin if approved
- Cleaner than wildcards

**Common CORS misconceptions**:

**1. "CORS protects my server"**:
- NO — CORS protects users from malicious sites
- Servers can be called from anywhere (curl, Postman, scripts)
- Don't rely on CORS for security

**2. "Just set \`Access-Control-Allow-Origin: *\`"**:
- Disables credentials (no cookies)
- Permissive for public APIs only

**3. "CORS issues are server's problem"**:
- Sometimes proxies, browsers cache preflights weirdly
- Frontend must make valid requests too

**Bypassing CORS** (legitimate methods):

**1. Same origin**: Reverse proxy, e.g., nginx proxies /api to backend, both on same domain.

**2. Server-side requests**: Make requests from your server, not browser. No CORS limit on server-to-server.

**3. JSONP**: Old hack using \`<script>\` tag (bypasses SOP). Limited to GET. Insecure. Don't use.

## Real-World Example
**SPA + API on different domains**:
- Frontend: \`https://app.mystartup.com\`
- API: \`https://api.mystartup.com\`
- API enables CORS for app.mystartup.com origin
- Browser allows requests

**Public API** (read-only):
- \`Access-Control-Allow-Origin: *\`
- No credentials needed
- Anyone's site can call from browser

**B2B API** (with auth):
- Whitelist customer's domains
- Allow credentials (or use Authorization header)
- Per-customer CORS configuration

**Common architecture — same-origin via proxy**:
- Frontend served by nginx
- nginx proxies /api/* to backend
- All requests appear same-origin → no CORS

## Interview Tips
- CORS is a BROWSER mechanism, not server security
- Same-Origin Policy is the underlying restriction
- Preflight OPTIONS requests for non-simple requests
- Common errors and their causes

## Common Follow-up Questions
1. Same-origin policy vs CORS? (SOP: default browser restriction. CORS: opt-in mechanism for relaxing it.)
2. What's a preflight request? (OPTIONS sent before non-simple requests to check authorization)
3. Why \`*\` not allowed with credentials? (Security — wildcard with cookies could allow any site to act as authenticated user)`,

    'WebSockets': `## Definition
**WebSockets** provide a full-duplex, bidirectional communication channel over a single TCP connection between a client and server. Unlike HTTP's request/response model, WebSockets allow both sides to send messages anytime — ideal for real-time applications like chat, gaming, and live updates.

## Why It Matters
Modern real-time web applications depend on WebSockets. Understanding them is essential for building chat apps, collaborative tools, live dashboards, multiplayer games, and any system where the server needs to push data to clients.

## Detailed Explanation

**The problem WebSockets solve**:

Traditional HTTP:
- Client requests, server responds
- Server can't initiate communication
- For "real-time" updates: poll repeatedly (waste) or long-poll (hacky)

WebSockets:
- Persistent connection
- Both sides can send messages anytime
- Low overhead per message after handshake

**WebSocket handshake**:

Starts as an HTTP request asking to "upgrade" to WebSocket protocol:

\`\`\`
Client request:
GET /chat HTTP/1.1
Host: example.com
Upgrade: websocket
Connection: Upgrade
Sec-WebSocket-Key: base64-random-key
Sec-WebSocket-Version: 13

Server response:
HTTP/1.1 101 Switching Protocols
Upgrade: websocket
Connection: Upgrade
Sec-WebSocket-Accept: base64-derived-from-key
\`\`\`

After handshake, the same TCP connection switches to WebSocket protocol — no longer HTTP.

**WebSocket protocol**:

- Binary protocol (more efficient than text HTTP)
- Frames: small headers + payload
- Two main message types: TEXT (UTF-8) and BINARY
- Control frames: PING, PONG (heartbeat), CLOSE

**URL schemes**:
- \`ws://\` — unencrypted (like http://)
- \`wss://\` — encrypted via TLS (like https://)

Always use \`wss://\` in production.

**JavaScript WebSocket API**:

\`\`\`js
const ws = new WebSocket('wss://example.com/chat');

ws.onopen = () => {
  console.log('Connected');
  ws.send('Hello server!');
};

ws.onmessage = (event) => {
  console.log('Received:', event.data);
};

ws.onclose = () => {
  console.log('Disconnected');
};

ws.onerror = (error) => {
  console.error('Error:', error);
};

// Send a message
ws.send(JSON.stringify({ type: 'chat', text: 'Hi' }));

// Close connection
ws.close();
\`\`\`

**Server-side (Node.js)**:

\`\`\`js
const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 8080 });

wss.on('connection', (ws) => {
  ws.on('message', (data) => {
    // Echo to all clients
    wss.clients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(data);
      }
    });
  });
});
\`\`\`

**WebSockets vs alternatives**:

**vs HTTP polling**:
- Polling: client checks every N seconds (wasteful, latency)
- WebSocket: instant updates, single connection

**vs Long polling**:
- Long polling: HTTP request waits for data (more efficient than short polling)
- WebSocket: lower overhead, true bidirectional

**vs Server-Sent Events (SSE)**:
- SSE: server-to-client only, simpler, HTTP-based
- WebSocket: bidirectional, more complex

**vs Webhooks**:
- Webhooks: server-to-server callbacks, async, no persistent connection
- WebSocket: client-server, persistent

| Use case | Best choice |
|----------|------------|
| Live data display (stock ticker) | SSE or WebSocket |
| Chat | WebSocket |
| Collaborative editing | WebSocket |
| Notifications | SSE or WebSocket |
| Server-to-server events | Webhooks or message queue |

**Use cases for WebSockets**:

**1. Chat applications**: Real-time messaging (Slack, WhatsApp web).

**2. Live collaboration**: Google Docs, Figma, Notion.

**3. Multiplayer games**: Real-time game state sync.

**4. Live dashboards**: Stock prices, monitoring metrics.

**5. Notifications**: Push notifications without polling.

**6. Live sports scores**: Real-time updates without refresh.

**7. Real-time auctions / bidding**.

**Challenges**:

**1. Stateful connections**:
- Server must remember which clients are connected
- Hard to scale horizontally — connections "stick" to one server
- Solutions: sticky sessions, message broker (Redis pub/sub), specialized services

**2. Reconnection**:
- Connections drop (mobile networks, sleep, etc.)
- Client must detect and reconnect
- Server may have lost state
- Pattern: exponential backoff, resume from last message

**3. Authentication**:
- WebSocket handshake is HTTP — can use cookies/headers
- After handshake, no per-message auth — trust the connection
- For sensitive: include token in handshake URL or first message

**4. Scaling**:
- Each WebSocket connection takes server resources (memory, file descriptor)
- Thousands of concurrent connections per server typical
- Ten of thousands needs careful tuning
- Beyond: specialized infra (Pusher, Ably, AWS API Gateway WebSocket)

**5. Firewalls and proxies**:
- Some block WebSockets (corporate firewalls)
- Long-lived connections may be killed
- Use \`wss://\` (port 443) — generally allowed

**Heartbeats / Keepalive**:
- Send PING frame periodically
- Server responds with PONG
- Detects dead connections
- Most libraries handle automatically

**Error handling**:
- Connection drops are normal — design for it
- Auto-reconnect with backoff
- Reconcile state after reconnect (catch up on missed messages)

**Sub-protocols**:
- Application-level protocol over WebSocket
- Negotiated during handshake
- Examples: STOMP, MQTT-over-WebSocket
- Useful for structured messaging

**Socket.IO**:
- Popular library on top of WebSocket
- Falls back to long polling if WS unavailable
- Adds rooms, namespaces, automatic reconnection
- Slight overhead vs raw WebSocket

**Security considerations**:

**1. Always use wss://**: Encrypts traffic, prevents eavesdropping/tampering.

**2. Validate Origin**: Check Origin header during handshake (anti-CSRF).

**3. Authenticate properly**: Token in handshake; verify per-connection.

**4. Rate limit**: WebSockets can flood server with messages.

**5. Validate input**: Same as any API — sanitize, validate.

## Real-World Example
**Slack-like chat**:
- WebSocket connection per client
- Server broadcasts new messages to all in channel
- Typing indicators, presence updates pushed instantly

**Trading platform**:
- WebSocket pushes price updates 100s of times per second
- Polling would either lag or hammer the server
- WebSocket is essential

**Multiplayer game** (web-based):
- WebSocket carries player positions, actions
- Low latency requirements
- 60 updates per second per client

**Live sports app**:
- Score updates pushed to all viewing clients
- Without WebSocket: app polls every 5 seconds (delay + load)

**Code editing collaboration**:
- Each keystroke sent over WebSocket
- Server broadcasts to other collaborators
- Operational Transform or CRDT for conflict resolution

**Famous example — Discord**:
- 100M+ concurrent WebSocket connections
- Custom infrastructure for scale
- Each shard handles a subset of guilds

## Interview Tips
- WebSocket = bidirectional, persistent connection
- Handshake starts as HTTP, upgrades
- ws:// vs wss:// (always wss://)
- Mention scaling challenges (sticky sessions, pub/sub)

## Common Follow-up Questions
1. WebSocket vs HTTP polling? (Persistent vs repeated requests; efficiency, latency)
2. How to scale WebSockets? (Sticky sessions, Redis pub/sub for cross-server messaging, specialized services)
3. WebSocket vs Server-Sent Events? (WS: bidirectional. SSE: server-to-client, simpler, HTTP-based.)`,

    'gRPC': `## Definition
**gRPC** is a modern, high-performance Remote Procedure Call (RPC) framework developed by Google. It uses HTTP/2 for transport, Protocol Buffers (protobuf) for serialization, and provides features like streaming, authentication, and load balancing. It's particularly popular for microservices communication.

## Why It Matters
gRPC has become the standard for high-performance microservice communication, especially in cloud-native and Kubernetes environments. Understanding it positions you for modern backend system design.

## Detailed Explanation

**gRPC vs REST**:

**REST**:
- HTTP/1.1 (usually)
- Text-based JSON
- Stateless request/response
- Universal but verbose

**gRPC**:
- HTTP/2 (mandatory)
- Binary Protocol Buffers
- Supports streaming
- Compact, fast

**Comparison**:

| Aspect | REST | gRPC |
|--------|------|------|
| Protocol | HTTP/1.1 (often) | HTTP/2 |
| Format | JSON (text) | Protobuf (binary) |
| Schema | Optional (OpenAPI) | Required (.proto files) |
| Streaming | Limited | Bidirectional native |
| Browser support | Native | gRPC-Web (proxy needed) |
| Verbosity | More | Less |
| Performance | Good | Better |
| Tooling | Mature | Growing |

**Protocol Buffers (protobuf)**:

Schema definition language:

\`\`\`protobuf
syntax = "proto3";

message User {
  int32 id = 1;
  string name = 2;
  string email = 3;
}

service UserService {
  rpc GetUser (UserRequest) returns (User);
  rpc CreateUser (CreateUserRequest) returns (User);
  rpc StreamUsers (UsersFilter) returns (stream User);
}
\`\`\`

Compiler generates client and server code in many languages. Type-safe, version-tolerant.

**4 RPC types**:

**1. Unary (most common)**:
- Single request, single response
- Like a regular function call
- \`rpc GetUser(UserRequest) returns (User);\`

**2. Server streaming**:
- Single request, stream of responses
- E.g., subscribe to events
- \`rpc StreamUpdates(SubscribeRequest) returns (stream Update);\`

**3. Client streaming**:
- Stream of requests, single response
- E.g., upload chunks, then get result
- \`rpc UploadFile(stream FileChunk) returns (UploadStatus);\`

**4. Bidirectional streaming**:
- Both sides send streams
- E.g., chat, real-time gaming
- \`rpc Chat(stream ChatMessage) returns (stream ChatMessage);\`

**HTTP/2 features used**:

**1. Multiplexing**: Many requests on one connection (no head-of-line blocking).

**2. Streaming**: Native bidirectional streams.

**3. Header compression**: HPACK reduces overhead.

**4. Server push**: gRPC doesn't really use this.

**Performance benefits**:

**1. Binary serialization**: 3-10× smaller than JSON, faster to parse.

**2. HTTP/2 multiplexing**: Many concurrent calls per connection.

**3. Persistent connections**: Avoid handshake overhead.

**4. Schema-based**: Pre-compiled, no runtime parsing surprises.

Real benchmarks: gRPC is typically 2-7x faster than REST/JSON.

**Code generation**:

\`\`\`bash
protoc --go_out=. --go-grpc_out=. user.proto
# Generates user.pb.go, user_grpc.pb.go
\`\`\`

Languages: Go, Java, Python, C#, JavaScript, Ruby, Swift, etc.

**Client usage** (Go example):
\`\`\`go
conn, _ := grpc.Dial("server:50051", grpc.WithInsecure())
client := pb.NewUserServiceClient(conn)
user, err := client.GetUser(ctx, &pb.UserRequest{Id: 123})
\`\`\`

Looks like a regular function call — that's the RPC abstraction.

**Authentication**:

**1. SSL/TLS**: Standard transport encryption.

**2. Token-based**: Pass tokens via metadata.

**3. mTLS**: Mutual TLS — both client and server authenticate.

\`\`\`go
md := metadata.Pairs("authorization", "Bearer " + token)
ctx := metadata.NewOutgoingContext(context.Background(), md)
\`\`\`

**Error handling**:

gRPC uses status codes (different from HTTP):
- \`OK\`, \`CANCELLED\`, \`INVALID_ARGUMENT\`, \`NOT_FOUND\`, \`PERMISSION_DENIED\`, \`UNAUTHENTICATED\`, \`UNAVAILABLE\`, \`INTERNAL\`, etc.

Errors carry codes and messages, optionally rich details (typed protobuf).

**Browser support — gRPC-Web**:

Browsers can't speak raw gRPC (HTTP/2 framing not exposed via fetch).

**gRPC-Web**:
- Subset of gRPC
- Uses HTTP/1.1 or HTTP/2
- Limited streaming (server streaming only)
- Requires Envoy/proxy to translate to backend gRPC

**gRPC pros**:

**1. Performance**: Faster than REST.

**2. Type safety**: Schema-defined, compile-time checks.

**3. Streaming**: Native bidirectional support.

**4. Code generation**: Less boilerplate.

**5. Modern**: HTTP/2, TLS by default.

**6. Polyglot**: Works across languages.

**gRPC cons**:

**1. Browser limitations**: Need gRPC-Web + proxy.

**2. Tooling**: Less mature than REST (but growing).

**3. Debugging**: Binary format harder to inspect (need tools).

**4. Cross-org adoption**: Harder than REST due to setup.

**5. Versioning**: Schema evolution requires care.

**6. Caching**: HTTP caching doesn't apply directly.

**When to use gRPC**:

**Yes**:
- Microservices internal communication
- High-performance requirements
- Polyglot environment
- Streaming needs
- Strong typing valued

**No**:
- Public APIs (browser/general consumer)
- Simple use cases (REST sufficient)
- Tight coupling to schemas problematic

**gRPC in microservices**:

Common pattern:
- gRPC for service-to-service
- REST or GraphQL for client-facing
- Load balancers (Envoy, Linkerd) handle gRPC routing
- Service mesh integration

**Service mesh** (Istio, Linkerd):
- Native gRPC support
- mTLS between services
- Traffic shaping, retries, circuit breakers

**Comparison with other RPC**:

**Apache Thrift**: Older, similar concept, less popular now.

**JSON-RPC**: Simple, widely supported, no binary efficiency.

**SOAP**: Verbose XML-based, enterprise legacy.

**GraphQL**: Different paradigm — flexible queries, single endpoint.

## Real-World Example
**Microservice architecture**:
- Order service (Java) calls Inventory service (Go) via gRPC
- Both have shared .proto file → generated client/server stubs
- Type-safe, fast, streamlined

**Real-time data pipeline**:
- Service A streams events to Service B
- Server streaming: \`rpc StreamEvents() returns (stream Event);\`
- Single connection, many events

**Mobile + backend**:
- gRPC client in iOS/Android app
- Strong typing across language boundary
- Efficient over cellular networks (binary smaller than JSON)

**Kubernetes / Cloud Native**:
- Many CNCF projects use gRPC
- Kubernetes API: protobuf internally
- Etcd: gRPC for cluster communication

**Production examples**:
- **Google**: Internal RPC for years (Stubby, then gRPC)
- **Netflix**: Microservices communication
- **Square**: Service mesh + gRPC
- **CockroachDB**: Inter-node communication

## Interview Tips
- gRPC = HTTP/2 + Protobuf
- 4 RPC types: unary, server stream, client stream, bidirectional
- Better for microservices; worse for browsers
- Mention service meshes (Istio) and gRPC

## Common Follow-up Questions
1. gRPC vs REST? (Binary + HTTP/2 + schema vs text + HTTP/1.1 + flexible)
2. Why HTTP/2? (Multiplexing, streaming, header compression — better for many small requests)
3. Browser support? (gRPC-Web subset, requires proxy)`,

    'GraphQL': `## Definition
**GraphQL** is a query language and runtime for APIs developed by Facebook. Unlike REST's multiple endpoints with fixed responses, GraphQL has a single endpoint where clients specify exactly what data they need. The server returns precisely that — no over-fetching, no under-fetching.

## Why It Matters
GraphQL solves real REST limitations and is widely adopted (Facebook, GitHub, Shopify, Netflix). Understanding it is increasingly important, though it has significant trade-offs vs REST.

## Detailed Explanation

**The problem GraphQL solves**:

REST issues:
- **Over-fetching**: Endpoint returns fields you don't need
- **Under-fetching**: Need data from multiple endpoints (waterfall requests)
- **Versioning**: Adding fields breaks clients or requires v2

GraphQL: Client says exactly what it wants. Server returns exactly that. One request.

**GraphQL example**:

REST:
\`\`\`
GET /users/123
Response: {id, name, email, address, phone, ...20 more fields}

GET /users/123/posts
Response: [...all posts with all fields]
\`\`\`

GraphQL:
\`\`\`graphql
query {
  user(id: 123) {
    name
    posts {
      title
      publishedAt
    }
  }
}
\`\`\`

Response (exactly what asked):
\`\`\`json
{
  "data": {
    "user": {
      "name": "Alice",
      "posts": [
        {"title": "Hello", "publishedAt": "2024-01-15"}
      ]
    }
  }
}
\`\`\`

**GraphQL operations**:

**1. Query** (read):
\`\`\`graphql
query {
  user(id: 123) { name email }
}
\`\`\`

**2. Mutation** (write):
\`\`\`graphql
mutation {
  createUser(input: { name: "Alice", email: "a@b.com" }) {
    id
    name
  }
}
\`\`\`

**3. Subscription** (real-time, via WebSocket):
\`\`\`graphql
subscription {
  newMessage { id text from }
}
\`\`\`

**Schema definition**:

\`\`\`graphql
type User {
  id: ID!
  name: String!
  email: String!
  posts: [Post!]!
}

type Post {
  id: ID!
  title: String!
  body: String!
  author: User!
}

type Query {
  user(id: ID!): User
  users: [User!]!
}

type Mutation {
  createUser(input: CreateUserInput!): User!
  updateUser(id: ID!, input: UpdateUserInput!): User!
}
\`\`\`

\`!\` = required, \`[]\` = list.

**Resolvers**:

Server code that fetches data for each field:

\`\`\`js
const resolvers = {
  Query: {
    user: (_, { id }) => db.users.findById(id),
    users: () => db.users.findAll()
  },
  User: {
    posts: (user) => db.posts.findByUserId(user.id)
  },
  Mutation: {
    createUser: (_, { input }) => db.users.create(input)
  }
};
\`\`\`

GraphQL calls appropriate resolvers based on query.

**N+1 problem** (notorious GraphQL issue):

Query:
\`\`\`graphql
{
  users {  # 1 query for users
    posts { title }  # N queries (one per user)
  }
}
\`\`\`

Naive resolver: 1 + N database queries.

**Solution: DataLoader** (batching/caching):
- Collect all user IDs needing posts
- Single query: \`SELECT * FROM posts WHERE user_id IN (...)\`
- Distribute results to resolvers

DataLoader is essential for production GraphQL.

**GraphQL pros**:

**1. Precise data fetching**: Get exactly what you need.

**2. Single endpoint**: All data via /graphql.

**3. Strong typing**: Schema is a contract.

**4. Self-documenting**: Introspection — clients query schema.

**5. Tooling**: Strong (GraphiQL, Apollo Studio, etc.).

**6. Versioning**: Add fields without breaking clients; deprecate old fields.

**7. Multiple resources**: One round trip vs N REST calls.

**GraphQL cons**:

**1. Complexity**: Server harder to implement than REST.

**2. Caching**: HTTP caching doesn't apply (single endpoint, varied responses). Need app-level caching.

**3. N+1 problem**: Easy to create accidentally; need DataLoader.

**4. Performance**: Complex queries can be slow; need depth/complexity limits.

**5. File uploads**: Not native; needs multipart spec.

**6. Error handling**: Single 200 response with errors in body — different from REST.

**7. Learning curve**: Different paradigm.

**Schema design considerations**:

**1. Avoid deeply nested fields**: Cause N+1, hard to optimize.

**2. Pagination**: Use cursors (Relay-style):
\`\`\`graphql
type UserConnection {
  edges: [UserEdge!]!
  pageInfo: PageInfo!
}
\`\`\`

**3. Consistent naming**: camelCase fields, PascalCase types.

**4. Errors as values**: Use union types for expected errors:
\`\`\`graphql
union LoginResult = AuthSuccess | InvalidCredentials | AccountLocked
\`\`\`

**Security considerations**:

**1. Query depth limit**: Prevent malicious deep queries.

**2. Query complexity analysis**: Compute cost; reject expensive queries.

**3. Rate limiting**: Per-user, per-query.

**4. Authorization**: Per-resolver, per-field. More granular than REST.

**5. Disable introspection in production** (optional — security through obscurity, controversial).

**GraphQL servers**:

**Apollo Server** (Node.js): Most popular, feature-rich.

**Express-graphql**: Lighter Node.js option.

**GraphQL-Java** (Java).

**Graphene** (Python).

**graphql-go**.

**Hot Chocolate** (.NET).

**GraphQL clients**:

**Apollo Client**: React/Vue/Angular. Cache, optimistic updates.

**Relay** (Facebook): Strict, opinionated, very efficient.

**urql**: Lightweight Apollo alternative.

**Federation and stitching**:

For microservices:

**Apollo Federation**: Each service has subgraph. Gateway combines. Most adopted.

**Schema stitching**: Older approach; combine multiple schemas.

**Comparison summary**:

| Aspect | REST | GraphQL |
|--------|------|---------|
| Endpoints | Many | One |
| Data fetching | Fixed shape | Client-specified |
| Versioning | URLs (v1, v2) | Field deprecation |
| Caching | HTTP caching | App-level |
| Discoverability | OpenAPI | Introspection |
| Learning curve | Lower | Higher |
| Complexity | Lower | Higher |

**When to use GraphQL**:

**Yes**:
- Mobile/SPAs with bandwidth concerns
- Many client types with different data needs
- Microservices behind a unified API
- Complex, related data graphs

**No**:
- Simple CRUD apps (REST is fine)
- File uploads/downloads dominant
- Heavy caching requirements
- Small team, simplicity valued

## Real-World Example
**GitHub API v4 (GraphQL)**:
- Replaced/supplemented REST v3
- Clients query exactly the fields needed
- One request for issues + their comments + their authors
- Saves bandwidth on mobile

**Mobile app with sparse data needs**:
- Same backend serves Web, iOS, Android
- Each fetches only fields it displays
- No "v2 endpoint for new mobile app"

**E-commerce product page**:
- Needs: product, reviews summary, related products, price history
- REST: 4 endpoints, 4 round trips
- GraphQL: 1 query, 1 round trip

**Famous adopters**:
- **GitHub**: Public GraphQL API
- **Shopify**: Storefront API
- **Facebook**: Original creator
- **Netflix**: Internal use
- **Twitter**: Some endpoints

## Interview Tips
- GraphQL: client-specified data shape, single endpoint
- N+1 problem and DataLoader is a classic interview topic
- Trade-offs vs REST — neither is universally better
- Strong typing, introspection, schema-first

## Common Follow-up Questions
1. REST vs GraphQL? (Multiple endpoints fixed shape vs single endpoint flexible queries)
2. What's the N+1 problem? (Naive resolver triggers query per item; DataLoader batches)
3. How is caching different? (HTTP caching ineffective; need application-level (Apollo Client cache))`,

    'Load Balancers': `## Definition
A **load balancer** is a system that distributes incoming network traffic across multiple servers to ensure no single server is overwhelmed. It improves application availability, scalability, and performance by spreading load and routing around failures.

## Why It Matters
Load balancers are fundamental infrastructure for any production system handling significant traffic. Understanding load balancing is essential for system design interviews and building scalable services.

## Detailed Explanation

**Why load balance**:

**1. Scalability**: One server has limits; load across many for higher capacity.

**2. Availability**: If one server fails, others continue serving.

**3. Performance**: Distribute requests to least-loaded servers.

**4. Maintenance**: Take servers down for updates without downtime.

**Load balancer placement**:

\`\`\`
Internet → DNS → Load Balancer → Server 1
                              → Server 2
                              → Server 3
\`\`\`

LB sits in front of server pool, routes incoming requests.

**Load balancing algorithms**:

**1. Round Robin**:
- Requests to servers in order: 1, 2, 3, 1, 2, 3...
- Simple, fair (assuming equal servers)
- Doesn't account for actual load

**2. Weighted Round Robin**:
- Servers have weights: heavier server gets more requests
- E.g., Server A (weight 3), Server B (weight 1) → 3:1 traffic ratio
- Useful when servers have different capacities

**3. Least Connections**:
- Send to server with fewest active connections
- Adapts to actual load
- Good for long-lived connections

**4. Weighted Least Connections**: Combines weights and connection counts.

**5. Least Response Time**:
- Server with lowest response time gets request
- Adapts to actual performance
- More overhead to track

**6. IP Hash**:
- Hash client IP → consistent server
- Same client always goes to same server
- Useful for session affinity (without dedicated mechanism)

**7. URL Hash**:
- Hash URL → consistent server
- Cache locality (same content always served from same server)
- Used by CDNs

**8. Random**: Pick randomly. Surprisingly good for many cases.

**9. Resource-based**: Based on CPU/memory metrics.

**Layer 4 (Transport) vs Layer 7 (Application)**:

**Layer 4 (TCP/UDP)**:
- Routes based on IP/port
- Fast — minimal inspection
- Doesn't understand HTTP
- Examples: AWS NLB (Network Load Balancer), HAProxy in TCP mode

**Layer 7 (HTTP)**:
- Routes based on HTTP attributes (URL, headers, cookies)
- Slower — parses HTTP
- Powerful: routing by path, A/B testing, etc.
- Examples: AWS ALB, Nginx, Envoy

**Layer 7 capabilities**:
- Route /api/* to API servers, /static/* to static servers
- SSL termination
- Caching
- Compression
- Header manipulation
- WebSocket support

**Health checks**:

LB regularly probes backend servers:
- HTTP: GET /health, expect 200
- TCP: connect on port
- Custom checks

Unhealthy servers removed from rotation; checked again periodically.

**Active vs Passive health checks**:
- **Active**: LB initiates checks (most common)
- **Passive**: LB observes real traffic for failures

**Session affinity (sticky sessions)**:

Some apps store session state in memory. Subsequent requests from same client must reach same server.

**Methods**:
- Cookie-based: LB sets a cookie identifying server
- IP-based: hash client IP
- App-controlled: app sets cookie LB respects

**Trade-offs**:
- Pros: simple for stateful apps
- Cons: uneven load, breaks failover, scaling issues

**Better alternative**: Stateless apps with shared session store (Redis).

**SSL termination**:

LB decrypts HTTPS, sends HTTP to backend:
- Centralizes certificate management
- Backend servers don't need certs
- Reduces backend load (no encryption)
- Trade-off: traffic between LB and backend in plaintext (often within trusted network)

Alternative: SSL passthrough (LB just forwards encrypted) — less common.

**Types of load balancers**:

**1. Hardware (F5, Citrix)**:
- Dedicated appliances
- Expensive but fast
- Largely replaced by software

**2. Software**:
- **Nginx**: Web server + LB
- **HAProxy**: Specialized LB
- **Envoy**: Modern, used in service meshes
- **Traefik**: Cloud-native, dynamic
- Run on commodity hardware

**3. Cloud-managed**:
- AWS: ALB (L7), NLB (L4), CLB (legacy)
- GCP: HTTP(S) Load Balancing, Network Load Balancing
- Azure: Load Balancer, Application Gateway
- Auto-scaling, managed
- Most common in cloud apps

**4. DNS-based** (limited):
- DNS returns multiple IPs
- Client picks one
- Round-robin via DNS responses
- Cache TTL issues; not real load balancing

**5. Anycast**:
- Same IP advertised from multiple locations via BGP
- Routers send to nearest
- Used by 8.8.8.8, CloudFlare, CDNs

**Geographic / Global Load Balancing**:

Multi-region:
- DNS-based: route to nearest region
- Anycast: similar
- AWS Route 53, GCP Global LB
- Latency-based or geo-routing

Common pattern:
- Global LB distributes to regional LBs
- Regional LBs distribute to local servers

**Single point of failure**:

LB itself can fail. Solutions:
- Active-passive: Standby LB takes over via VIP failover
- Active-active: Multiple LBs sharing load (DNS or anycast)
- Cloud LBs: managed redundancy

**Modern context — service mesh**:

In Kubernetes, service mesh (Istio, Linkerd) provides:
- Per-service load balancing (sidecar proxies)
- Smart routing (canary, A/B)
- mTLS
- Observability

Each pod has Envoy sidecar — distributed load balancing.

**Common patterns**:

**1. Layered**: Internet → CDN → LB → App servers → Internal LB → Database

**2. Microservices**: API gateway as LB, then per-service load balancing

**3. Multi-region**: Global LB → regional LBs → service LBs

## Real-World Example
**E-commerce site**:
- Internet → DNS → CloudFlare CDN → AWS ALB → 20 EC2 instances
- ALB routes /api/* to API servers, /* to web servers
- Health checks remove failing instances
- Auto-scaling adds instances during peak

**Microservices** (Kubernetes):
- Service A → Kubernetes Service (kube-proxy iptables) → 5 pods
- Or: Service A → Envoy sidecar → other services' pods
- Per-request load balancing

**Database read replicas**:
- App → ProxySQL/PgBouncer → primary (writes), replicas (reads)
- Load balanced across replicas
- Routing by query type

**Famous outages prevented**:
- Server crashes — LB removes from rotation, traffic reroutes seamlessly
- Deployment — rolling updates, gradually shift traffic

## Interview Tips
- Know algorithms (round robin, least connections, hash)
- Layer 4 vs Layer 7 distinction
- Health checks and how they work
- Mention sticky sessions trade-offs

## Common Follow-up Questions
1. Layer 4 vs Layer 7 LB? (Network packets vs application protocol awareness)
2. What's session affinity? (Sticky sessions — same client always to same server)
3. How does LB detect server failure? (Health checks — HTTP, TCP, custom)`,

    'Reverse Proxy': `## Definition
A **reverse proxy** is a server that sits in front of one or more origin servers and forwards client requests to them. From the client's perspective, the reverse proxy IS the server. Reverse proxies provide load balancing, caching, SSL termination, security, and many other features.

## Why It Matters
Reverse proxies are ubiquitous in modern web infrastructure. Nearly every production website uses one. Understanding their role is essential for backend, DevOps, and system design.

## Detailed Explanation

**Forward proxy vs Reverse proxy**:

**Forward proxy**:
- Sits between CLIENT and internet
- Client knows about it; configured to use it
- Hides client identity from servers
- Examples: corporate web filters, VPNs

**Reverse proxy**:
- Sits between INTERNET and origin servers
- Clients don't know it's a proxy (think it's the server)
- Hides origin servers from clients
- Examples: Nginx, Cloudflare, AWS ALB

\`\`\`
Forward proxy:    Client → [Forward Proxy] → Server
Reverse proxy:    Client → [Reverse Proxy] → Server
\`\`\`

The "forward" and "reverse" refers to whose side it represents.

**Functions of reverse proxy**:

**1. Load balancing**: Distribute requests across backend servers (covered in detail in load balancer topic).

**2. SSL termination**: Decrypt HTTPS, send HTTP to backend. Centralizes certificate management.

**3. Caching**: Store responses; serve cached versions for subsequent identical requests. Massive performance boost.

**4. Compression**: Compress responses (gzip, brotli) before sending to client.

**5. Security**:
   - Hide internal network topology
   - Web Application Firewall (WAF) — block attacks
   - DDoS mitigation
   - Rate limiting

**6. Routing**: Route requests by URL, headers, etc. to different backend services.

**7. Static content serving**: Serve static files directly without hitting app servers.

**8. Authentication**: Validate tokens before forwarding (auth gateway pattern).

**9. Logging and monitoring**: Centralized request logging.

**10. Connection pooling**: Maintain persistent connections to backends (avoid backend connection setup overhead).

**11. Slowloris protection**: Slow-client buffering — protects backend from slow connections.

**Common reverse proxies**:

**1. Nginx**:
- Most popular
- Fast, lightweight
- Supports HTTP/1.1, HTTP/2, HTTP/3
- Wide use as web server + reverse proxy
- Configuration via nginx.conf

**2. Apache (mod_proxy)**:
- Widely deployed
- More features but heavier than Nginx

**3. HAProxy**:
- Specialized for load balancing
- Excellent performance
- TCP and HTTP support

**4. Envoy**:
- Modern, designed for microservices
- Used by service meshes (Istio, App Mesh)
- gRPC native support
- Dynamic configuration via xDS APIs

**5. Traefik**:
- Cloud-native, auto-discovers services
- Popular with Docker, Kubernetes
- Let's Encrypt integration

**6. Caddy**:
- Easy configuration
- Automatic HTTPS via Let's Encrypt
- Modern Go-based

**7. Cloud-managed**:
- AWS CloudFront, ALB
- CloudFlare
- Google Cloud Load Balancer
- Azure Front Door

**Nginx example configuration**:

\`\`\`nginx
upstream backend {
    server backend1.example.com:3000;
    server backend2.example.com:3000;
    server backend3.example.com:3000;
}

server {
    listen 443 ssl;
    server_name example.com;

    ssl_certificate /etc/ssl/certs/example.com.crt;
    ssl_certificate_key /etc/ssl/private/example.com.key;

    # Static files served directly
    location /static/ {
        root /var/www/html;
        expires 1d;
    }

    # API proxied to backend
    location /api/ {
        proxy_pass http://backend;
        proxy_set_header Host \\$host;
        proxy_set_header X-Real-IP \\$remote_addr;
        proxy_set_header X-Forwarded-For \\$proxy_add_x_forwarded_for;
    }

    # Cache responses
    location / {
        proxy_pass http://backend;
        proxy_cache my_cache;
        proxy_cache_valid 200 1h;
    }
}
\`\`\`

**Headers added by reverse proxies**:

- **X-Forwarded-For**: Original client IP (proxy adds itself, chain visible)
- **X-Real-IP**: Just the client IP
- **X-Forwarded-Proto**: Original protocol (http/https)
- **X-Forwarded-Host**: Original host header
- **X-Forwarded-Port**: Original port

Backend servers should look at these (when behind a trusted proxy) for client info.

**Security: don't trust headers from arbitrary clients**:
- If anyone can directly access backend, they could spoof X-Forwarded-For
- Trust only when behind a known proxy
- Most frameworks have a "trusted proxies" config

**Caching strategies**:

**1. Static caching**: Static files (images, CSS, JS) cached aggressively.

**2. Dynamic caching**: Some dynamic responses cached based on URL, headers.

**3. Conditional caching**: Cache only successful (200) responses.

**4. Cache invalidation**: PURGE requests, content changes update cache.

**SSL/TLS termination**:

\`\`\`
Client --HTTPS--> Proxy --HTTP--> Backend
\`\`\`

- Single place to manage certificates
- Backend doesn't pay encryption cost
- Internal traffic in plaintext (if backend is on trusted network)

For sensitive: re-encrypt to backend (TLS to backend).

**WebSocket support**:

Reverse proxies need explicit config for WebSockets:

\`\`\`nginx
location /ws/ {
    proxy_pass http://backend;
    proxy_http_version 1.1;
    proxy_set_header Upgrade \\$http_upgrade;
    proxy_set_header Connection "upgrade";
    proxy_read_timeout 86400;  # 1 day for long-lived
}
\`\`\`

**Microservices and reverse proxies**:

**API Gateway pattern**:
- Single entry point for all API requests
- Routes to appropriate microservice
- Handles auth, rate limiting
- Examples: Kong, AWS API Gateway, Apigee

**Service mesh**:
- Sidecar proxy per service
- Handles service-to-service communication
- Mutual TLS, traffic shaping
- Envoy is the standard

**Common architectures**:

**Simple**:
\`\`\`
Internet → Nginx → Application
\`\`\`

**Production**:
\`\`\`
Internet → CDN → Load Balancer → Reverse Proxy → App Servers
                                                  ↓
                                              Database
\`\`\`

**Microservices**:
\`\`\`
Internet → CDN → API Gateway → Service Mesh
                                  ↓
                              Microservices
\`\`\`

## Real-World Example
**Typical SaaS app deployment**:
- nginx in front of Node.js app
- Handles SSL (Let's Encrypt)
- Gzip compresses responses
- Caches static assets
- Routes /api/* to backend, /* to React build

**E-commerce site**:
- CloudFlare (CDN + WAF)
- AWS ALB (load balancing)
- Nginx (caching, internal routing)
- 50 backend servers
- Failures handled at multiple layers

**Internal microservices**:
- Service mesh with Envoy sidecars
- mTLS between services
- Circuit breaking
- Distributed tracing

**WordPress site**:
- Nginx (or Apache) reverse proxy
- PHP-FPM as backend
- Page caching for performance
- Standard pattern for any LAMP/LEMP stack

## Interview Tips
- Reverse proxy vs forward proxy distinction
- Common functions: LB, caching, SSL, security
- Nginx is the canonical example
- Mention API gateway and service mesh for microservices

## Common Follow-up Questions
1. Forward vs reverse proxy? (Client-side intermediary vs server-side intermediary)
2. Why SSL termination at proxy? (Centralized cert management; backend doesn't pay encryption cost)
3. What's an API gateway? (Specialized reverse proxy for microservice APIs — auth, routing, rate limiting)`,

    'CDN': `## Definition
A **CDN (Content Delivery Network)** is a geographically distributed network of servers that deliver web content to users from the location nearest to them. CDNs cache static content (images, videos, CSS, JS) at edge servers, reducing latency and offloading traffic from origin servers.

## Why It Matters
CDNs are fundamental for any global-scale web application. They dramatically improve performance, reduce costs, enhance security, and improve reliability. Major sites without CDNs are unimaginable today.

## Detailed Explanation

**The problem CDNs solve**:

Without CDN:
- All users hit your origin server
- Users far from origin: high latency (e.g., 200ms from US to Asia)
- Origin under heavy load
- Single point of failure

With CDN:
- Static content cached at hundreds of edge locations globally
- User served from nearest edge (e.g., 20ms vs 200ms)
- Origin load reduced 90%+
- Edge resilience, DDoS absorption

**How CDN works**:

1. User requests \`https://example.com/image.jpg\`
2. DNS routes to nearest CDN edge server
3. Edge server has it cached → returns immediately
4. Or: edge fetches from origin (cache miss), caches, returns
5. Subsequent users in that region: cache hit, fast

**CDN benefits**:

**1. Reduced latency**: Closer = faster. Geographic proximity matters.

**2. Reduced bandwidth costs**: Edge serves cached content; origin sees fraction of traffic.

**3. Higher availability**: Edge redundancy; origin issues don't take down the site.

**4. DDoS protection**: Massive edge capacity absorbs attacks.

**5. SSL offloading**: Edges handle SSL termination.

**6. Edge computing**: Run code at the edge (CloudFlare Workers, Lambda@Edge).

**7. Smoother traffic spikes**: Edge handles bursts.

**What CDNs cache**:

**Easy to cache** (static):
- Images, videos
- CSS, JavaScript
- Fonts
- Documents (PDF)
- Software downloads

**Harder to cache** (dynamic):
- HTML (per-user, sometimes cached briefly)
- API responses (varies by query, user)
- User-specific content

**Modern CDNs cache dynamic content too** with smart strategies.

**Cache control**:

Origin server tells CDN how to cache via headers:

\`\`\`
Cache-Control: public, max-age=3600  # cache for 1 hour
Cache-Control: no-cache  # validate before using
Cache-Control: no-store  # don't cache at all
Cache-Control: private  # only browser cache
ETag: "abc123"  # version identifier
Last-Modified: Wed, 15 Jan 2024 10:00:00 GMT
\`\`\`

**Cache invalidation**:

Hard problem in CDNs:
- TTL expiry: simple, predictable
- Manual purge: API call to invalidate (\`PURGE /image.jpg\`)
- Cache-busting URLs: \`image.jpg?v=2\` or \`image.abc123.jpg\` — changes URL = new cache entry

**Cache busting via filename hash**:
- \`app.css\` → \`app.f7b2c9.css\` (hash of contents)
- Change content → change hash → change filename → fresh fetch
- Set very long TTL (years) — content never changes for that filename
- Standard build tool pattern (Webpack, Vite, etc.)

**Major CDN providers**:

**1. CloudFlare**:
- Global, free tier available
- Strong DDoS protection
- Edge computing (Workers)
- DNS, security focus

**2. AWS CloudFront**:
- Integrated with AWS
- Lambda@Edge for edge compute
- Pay-as-you-go

**3. Akamai**:
- Largest, oldest
- Enterprise focus
- Expensive but mature

**4. Fastly**:
- Developer-focused
- Real-time purging
- VCL (Varnish-like) edge programming

**5. Google Cloud CDN**:
- Tightly integrated with GCP

**6. Microsoft Azure CDN**:
- Multiple back-end providers (Akamai, Verizon)

**CDN architecture**:

**Tiers**:

**1. Edge servers**: Closest to users (hundreds of locations)
**2. Regional caches** (mid-tier, optional): Larger caches between edge and origin
**3. Origin servers**: Source of truth

Cache hierarchy: edge → regional → origin. Cache miss at edge fetches from regional; miss there fetches from origin.

**Routing**:

How does request find nearest edge?

**1. DNS-based**: DNS returns IPs of nearest edge based on user's resolver location.

**2. Anycast**: Same IP advertised from many locations via BGP. Internet routes to nearest.

**3. HTTP redirect**: Less common; redirect to specific edge.

**Cache hit ratio**:

Key metric: \`cache_hits / total_requests\`

- 90%+ excellent
- 70-90% good
- < 50% poor (review cache config)

Higher = less origin traffic, lower latency.

**Origin shielding**:

Concept: one regional cache "in front" of origin. All other edges fetch from this regional cache, not origin directly.

Benefits:
- Even more origin traffic reduction
- Single point for origin to handle
- Better cache hit ratios

**Edge computing**:

Run code at the edge:
- Authentication
- A/B testing
- Personalization
- Image optimization on the fly
- API gateway functionality

**Examples**:
- **CloudFlare Workers**: JavaScript at the edge
- **Lambda@Edge** (AWS): Node.js, Python at CloudFront edges
- **Fastly Compute@Edge**: WebAssembly

**Use cases for edge compute**:
- A/B test bucketing without origin call
- Sign URLs for private content
- Strip/add headers
- Implement IP-based rules

**HTTP/2, HTTP/3, QUIC at the edge**:

Modern CDNs support latest protocols:
- Connection reuse benefits enhanced
- Faster handshakes (HTTP/3 / QUIC)
- Better mobile network performance

**Security features**:

**1. DDoS protection**: Edge capacity absorbs attacks.

**2. WAF (Web Application Firewall)**: Block malicious requests at edge.

**3. Bot management**: Detect and challenge bots.

**4. Rate limiting**: Per-user, per-IP, per-API.

**5. Geo-blocking**: Block traffic from specific countries (compliance).

**Real-time analytics**:

CDNs provide:
- Request counts by edge
- Cache hit ratio
- Bandwidth usage
- Top URLs, status codes
- Geographic breakdown

**Cost models**:

**Bandwidth**: Pay per GB transferred. Usually tiered.

**Requests**: Some charge per million requests.

**Tiered pricing**: First X GB cheap, more = cheaper rate.

**Free tier**: CloudFlare and others offer free CDN for moderate traffic.

**Common pitfalls**:

**1. Caching personalized content**: User A sees User B's data. Use Vary headers, private cache, or skip caching.

**2. Caching errors**: 5xx responses might get cached. Configure to skip errors or short TTL.

**3. Cache invalidation lag**: Pushed update doesn't appear for everyone immediately. Plan for it.

**4. SSL certificate management**: Origin needs valid cert; or "Flexible SSL" mode (less secure).

**5. Origin attacks**: If attackers find origin IP, they bypass CDN. Restrict origin to CDN IPs.

**Use cases**:

**1. Static sites**: Hugo, Jekyll, Next.js static export — fully on CDN.

**2. Images and videos**: Most bandwidth-heavy; biggest CDN benefit.

**3. Software distribution**: APK, package downloads. GitHub Releases, npm registry.

**4. Streaming**: Video CDNs (Akamai, Limelight) for HLS/DASH.

**5. APIs**: API responses cached at edge (with care).

## Real-World Example
**Netflix**:
- Massive CDN footprint (Open Connect)
- Custom hardware at ISPs
- Stream Netflix content from inside ISPs' networks
- Saves bandwidth, improves quality

**Wikipedia**:
- Aggressively caches at edge
- Articles change rarely; cache for hours
- Massive traffic served with relatively small origin

**E-commerce**:
- Product images from CDN
- HTML mostly from CDN (with cache-busting on price changes)
- Origin handles dynamic data only

**News sites during major events**:
- Traffic spikes 100x normal
- CDN absorbs the load
- Origin would melt without CDN

**Famous incident**: Fastly outage 2021 took down Reddit, Stack Overflow, NYT, Github briefly. Showed how dependent modern web is on CDNs.

## Interview Tips
- CDN = geographic distribution + caching
- Core benefit: latency + offload origin
- Cache invalidation is hard
- Mention CDN providers and edge compute

## Common Follow-up Questions
1. How does CDN choose closest edge? (DNS-based or anycast routing)
2. How to invalidate CDN cache? (TTL, manual purge, cache-busting URLs)
3. What about dynamic content? (Cache short TTL, edge compute, smart caching strategies)`,

    'NAT': `## Definition
**NAT (Network Address Translation)** is a method of remapping IP addresses by modifying network address information in packet headers as they pass through a router. It allows multiple devices on a private network to share a single public IP address, enabling efficient use of limited IPv4 addresses.

## Why It Matters
NAT is the workaround that lets the internet keep functioning despite IPv4 exhaustion. Every home and office router uses NAT. Understanding it explains many connectivity quirks (port forwarding, why incoming connections are hard, etc.).

## Detailed Explanation

**The problem NAT solves**:

IPv4 has 4.3 billion addresses — long since allocated. NAT lets one public IP serve many devices on a private network.

**Basic NAT operation**:

\`\`\`
Internal device (192.168.1.10:3000) → Router (NAT) → Internet (Server 8.8.8.8:80)
                                          ↓
                Translates source: 192.168.1.10:3000 → 73.45.12.100:5023
                                          ↓
                              Server sees: 73.45.12.100:5023
\`\`\`

NAT router maintains a translation table:

| Internal | External |
|----------|----------|
| 192.168.1.10:3000 | 73.45.12.100:5023 |
| 192.168.1.20:4500 | 73.45.12.100:5024 |

When server replies to 73.45.12.100:5023, router looks up entry, forwards to 192.168.1.10:3000.

**Types of NAT**:

**1. Static NAT (1:1)**:
- One private IP ↔ one public IP
- Predictable, but doesn't save addresses
- Used for servers needing fixed public IP

**2. Dynamic NAT**:
- Pool of public IPs assigned dynamically
- Saves IPs vs static
- Still 1:1 at any moment

**3. PAT (Port Address Translation) / NAPT / Overloaded NAT**:
- Multiple private IPs share one public IP
- Distinguished by port numbers
- Most common type — what your home router does
- Sometimes just called "NAT" colloquially

**Behavior types** (RFC terminology):

**1. Full Cone NAT**:
- Once mapped, ANY external host can reach the internal host via the mapping
- Most permissive
- Easy for inbound (P2P, etc.)

**2. Restricted Cone NAT**:
- External host can only reach if internal host has previously sent to it (IP-restricted)

**3. Port-Restricted Cone NAT**:
- Like restricted, but also port-specific

**4. Symmetric NAT**:
- Each connection gets new external port
- Different mapping per destination
- Most restrictive
- Hardest for P2P

**Modern routers often have hybrid behaviors**.

**NAT pros**:

**1. Saves IPv4 addresses**: One public IP for many devices.

**2. Security side effect**: Internal hosts not directly reachable from internet (no public IP).

**3. Topology hiding**: External world doesn't know internal layout.

**4. Renumbering**: Change ISP, internal addresses unchanged.

**NAT cons**:

**1. Inbound connections difficult**:
- External world doesn't know how to reach specific internal device
- No mapping for unsolicited inbound
- Requires port forwarding or NAT traversal techniques

**2. Breaks end-to-end principle**:
- IP addresses no longer end-to-end
- Some protocols assume direct addressing (FTP, IPsec, SIP) and break

**3. Connection state**:
- NAT must remember mappings
- Memory limit per NAT
- Stateful — affects scalability

**4. Connection timeouts**:
- Idle TCP connections may be dropped from NAT table
- Need keepalives for long-lived connections

**5. Logging complications**:
- Multiple users behind same public IP
- Hard to attribute traffic to individual

**Port forwarding**:

Manually configure NAT to forward specific external ports to specific internal hosts:

\`\`\`
External port 80 → 192.168.1.50:80 (web server inside)
External port 22 → 192.168.1.51:22 (SSH server inside)
\`\`\`

Allows running services internally accessible from internet.

**UPnP (Universal Plug and Play)**:
- Devices request port forwards automatically
- Used by games, BitTorrent, VoIP
- Security risk if untrusted devices abuse it

**NAT traversal techniques**:

For P2P, real-time apps (VoIP, video calls, gaming):

**1. STUN (Session Traversal Utilities for NAT)**:
- Server tells you your public IP/port
- Works for non-symmetric NATs
- Used by WebRTC

**2. TURN (Traversal Using Relays around NAT)**:
- Relay server in the middle
- Always works (even symmetric NAT)
- Higher latency, more bandwidth on relay

**3. ICE (Interactive Connectivity Establishment)**:
- Combines STUN, TURN
- Tries multiple paths, picks best
- Standard for WebRTC

**4. Hole punching**:
- Both sides send to each other simultaneously
- NATs create mappings, connection succeeds
- Works for many NAT types

**Carrier-Grade NAT (CGNAT)**:

ISPs run NAT at their edge:
- Customers share public IPs
- Multiple layers of NAT
- Many gamers and home users behind CGNAT
- Causes issues: same public IP for many; can't run servers; unfair-bot detection

**NAT and IPv6**:

IPv6 doesn't need NAT (vast address space). Each device gets public IP.

But:
- Some still use NAT66 (IPv6-to-IPv6 NAT) for similar reasons
- Mostly: IPv6 deployment slowed by IPv4 + NAT working "well enough"

**NAT and protocols**:

**TCP**: Works fine with NAT (connection-oriented, stateful).

**UDP**: Trickier — no connection state. NAT uses timeout heuristics. Hence NAT keepalives in protocols like WireGuard.

**ICMP**: Some types passed through with translated addresses.

**Application-layer issues**:

**FTP**: Old protocol embeds IP addresses in payload. NAT must inspect/modify (Application Layer Gateway).

**SIP (VoIP)**: Same problem.

**IPsec**: NAT can break IPsec authentication. Workaround: NAT-T (NAT Traversal).

**Common scenarios**:

**Home network**:
- Modem/router does NAT
- Internal: 192.168.1.0/24
- ISP gives one public IP
- All home devices share it

**Cloud VPC**:
- Private subnet: 10.0.0.0/24 (no internet)
- NAT Gateway translates outgoing for private instances
- Inbound through Load Balancer (different mechanism)

**CGN (mobile networks)**:
- Phone gets private IP
- Multiple layers of NAT to internet
- Reduces apparent IPv4 usage

## Real-World Example
**Home network**:
- 10 devices: phones, laptops, smart TV
- All have private IPs (192.168.x.x)
- Router NAT-translates outgoing requests
- All appear from same public IP to internet

**Hosting a Minecraft server at home**:
- Server runs on 192.168.1.50:25565
- Without port forwarding: friends can't connect
- Configure router: external port 25565 → 192.168.1.50:25565
- Now reachable

**Video call in browser (WebRTC)**:
- Both users behind NAT
- STUN servers tell each their public IP
- ICE finds connectivity path
- Direct P2P if possible; TURN relay if not

**Cloud architecture**:
- Web servers in public subnet (have public IPs via Internet Gateway)
- Database in private subnet (no public IP)
- DB needs to reach internet (e.g., for software updates)?
- NAT Gateway: outgoing-only translation

## Interview Tips
- NAT solved IPv4 exhaustion
- PAT (port-based) is what most networks use
- Inbound is hard — need port forwarding
- Mention STUN/TURN for NAT traversal

## Common Follow-up Questions
1. Why is NAT a "side-effect" firewall? (Internal hosts unreachable without explicit mapping)
2. What's CGNAT? (Carrier-grade NAT — ISPs share public IPs across many customers)
3. How does WebRTC handle NAT? (STUN tells public IP; TURN relays if direct fails)`,
    'Firewall': `## Definition
A **firewall** is a network security system that monitors and controls incoming and outgoing traffic based on predetermined security rules. It establishes a barrier between trusted internal networks and untrusted external networks (like the internet), permitting or blocking data packets based on a set of policies.

## Why It Matters
Firewalls are the first line of defense in network security. Every production system needs them. Understanding firewall types helps you design secure architectures and debug connectivity issues.

## Detailed Explanation

**Types of firewalls**:

**1. Packet-filtering firewalls** (Layer 3-4):
- Examines individual packets — source/destination IP, ports, protocol
- Stateless — doesn't track connections
- Fast but limited (can't tell if packet belongs to legitimate session)
- Example: basic iptables rules

**2. Stateful firewalls** (Layer 3-4):
- Tracks active connections (connection table)
- Knows which packets belong to established sessions
- Can allow return traffic for outgoing connections
- Most modern firewalls are stateful (iptables with conntrack, pf)

**3. Application-layer firewalls** (Layer 7):
- Inspects packet contents and application protocols
- Can block specific URLs, SQL injection, malicious payloads
- Web Application Firewalls (WAF): Cloudflare, AWS WAF, ModSecurity
- More CPU-intensive but catches sophisticated attacks

**4. Next-Generation Firewalls (NGFW)**:
- Combines stateful + DPI (deep packet inspection) + IPS (intrusion prevention)
- Application awareness, user identity, threat intelligence
- Examples: Palo Alto, Fortinet, Cisco Firepower

**Firewall rules**:
\`\`\`
# Allow SSH from specific IP
iptables -A INPUT -p tcp -s 203.0.113.5 --dport 22 -j ACCEPT

# Allow HTTP/HTTPS from anywhere
iptables -A INPUT -p tcp --dport 80 -j ACCEPT
iptables -A INPUT -p tcp --dport 443 -j ACCEPT

# Drop everything else
iptables -P INPUT DROP
\`\`\`

**Default policies**:
- **Default-deny** (whitelist): Block all, allow only what's explicitly permitted. More secure.
- **Default-allow** (blacklist): Allow all, block specific bad stuff. Less secure.

**Common deployments**:
- **Host firewall**: Per-machine (Windows Firewall, ufw on Linux)
- **Network firewall**: At network perimeter (between LAN and internet)
- **Cloud security groups**: AWS SG, GCP firewall rules — virtual firewalls per VM
- **Web Application Firewall**: In front of web apps, blocks Layer 7 attacks

## Real-World Example
**AWS architecture**: Public web tier → Security Group allows 80/443 from 0.0.0.0/0. Private database tier → Security Group allows 5432 only from web tier's SG. This network segmentation prevents direct internet access to the DB.

**Cloudflare WAF**: Sits in front of websites, blocks SQL injection patterns, XSS attempts, known malicious bots. Layer 7 protection.

## Interview Tips
- Stateful vs stateless is a common distinction
- WAF (Layer 7) vs network firewall (Layer 3/4) — important distinction
- Default-deny is more secure than default-allow
- Mention cloud security groups as modern firewall

## Common Follow-up Questions
1. Stateful vs stateless? (Stateful tracks connections; stateless examines each packet alone)
2. What's a WAF? (Web Application Firewall — Layer 7, inspects HTTP traffic)
3. Difference between firewall and IDS? (Firewall blocks; IDS detects/alerts)`,

    'VPN': `## Definition
A **Virtual Private Network (VPN)** creates an encrypted tunnel between a client and a server (or between two networks) over a public network like the internet. It allows remote users to securely access resources as if they were on the local network, and protects data from eavesdroppers.

## Why It Matters
VPNs power remote work, cross-region site connectivity, and consumer privacy products. Understanding how they work explains modern enterprise networking and the privacy/security trade-offs of consumer VPNs.

## Detailed Explanation

**Two main use cases**:

**1. Remote-access VPN**: Individual users connecting to a corporate network from home/coffee shop. Examples: company VPN clients, Cisco AnyConnect.

**2. Site-to-site VPN**: Connecting two physical networks (e.g., HQ and branch office) so they appear as one network. Often always-on between routers.

**How it works (conceptually)**:
1. VPN client establishes encrypted tunnel to VPN server
2. Authentication (certificate, username/password, MFA)
3. Server assigns a virtual IP from internal network
4. Client sends traffic; it's encrypted and tunneled to VPN server
5. Server decrypts and forwards to internal network
6. Replies routed back through the tunnel

**Common VPN protocols**:

**IPsec**: 
- Operates at Layer 3 (IP layer)
- Encrypts entire IP packets
- Used in site-to-site and some remote-access
- Modes: Tunnel mode (full encapsulation), Transport mode (just payload)

**OpenVPN**:
- Open source, runs over UDP or TCP
- Uses TLS for the tunnel
- Very flexible, widely supported
- Slower than IPsec/WireGuard

**WireGuard**:
- Modern (2018), much simpler codebase (~4000 lines)
- Better performance than OpenVPN/IPsec
- Built into Linux kernel since 5.6
- Becoming the new standard

**SSL/TLS VPN**:
- Uses HTTPS (port 443) — works through restrictive firewalls
- Examples: Cisco AnyConnect, Pulse Secure
- Easy to deploy (often browser-based)

**Split tunneling**:
- Send only specific traffic through VPN (e.g., corporate IPs)
- Other traffic goes directly to the internet
- Better performance, less VPN server load
- Less secure (DNS leaks, etc.)

**Full tunneling**: All traffic goes through VPN. More secure, slower.

**Consumer VPN services** (NordVPN, ExpressVPN, etc.):
- Privacy/anonymity tool, not security tool
- Hides your real IP from websites
- Does NOT encrypt traffic end-to-end (only to VPN server; from there, normal internet)
- Useful for: bypassing geo-restrictions, public Wi-Fi safety, hiding from ISP

## Real-World Example
**Working from home**: Connect to corporate VPN → get assigned 10.0.5.42 (internal IP). Now you can SSH to internal servers, access intranet, all as if you were in the office.

**Two AWS regions connected via VPN**: us-east-1 VPC (10.0.0.0/16) ↔ eu-west-1 VPC (10.1.0.0/16). Site-to-site VPN encrypts traffic between regions over public internet. Resources in either region can talk privately.

## Interview Tips
- Site-to-site vs remote-access distinction
- Know IPsec, OpenVPN, WireGuard
- Consumer VPNs are privacy tools, not security tools
- Split vs full tunneling trade-off

## Common Follow-up Questions
1. VPN vs HTTPS? (VPN tunnels everything at IP layer; HTTPS encrypts a single connection)
2. WireGuard advantages? (Simpler, faster, built into kernel)
3. Does VPN make you anonymous? (No — VPN provider sees everything; only hides from your ISP)`,

    'SSL/TLS Handshake': `## Definition
The **SSL/TLS handshake** is the process by which a client and server establish a secure encrypted connection. It involves protocol version negotiation, cipher suite selection, server (and optionally client) authentication via certificates, and exchange of keys for symmetric encryption of subsequent data.

## Why It Matters
TLS underlies HTTPS, secure email, VPNs, database connections — virtually all encrypted internet traffic. Understanding the handshake helps debug certificate errors, performance issues, and security questions.

## Detailed Explanation

**TLS 1.2 handshake** (classic, 2 round trips):

1. **Client Hello**:
   - Supported TLS versions
   - Supported cipher suites (e.g., ECDHE-RSA-AES256-GCM-SHA384)
   - Random number (client_random)
   - SNI (which hostname client wants — for virtual hosting)

2. **Server Hello**:
   - Chosen TLS version
   - Chosen cipher suite
   - Random number (server_random)

3. **Server Certificate**:
   - Server's X.509 certificate chain
   - Client validates: signed by trusted CA? Hostname matches? Not expired? Not revoked?

4. **Server Key Exchange** (for ephemeral DH):
   - Server's DH parameters, signed with private key

5. **Server Hello Done**: "I'm done; over to you"

6. **Client Key Exchange**:
   - Client computes pre-master secret using server's DH params
   - Both sides derive identical session keys from pre_master + client_random + server_random

7. **Change Cipher Spec + Finished** (both sides):
   - Switch to encrypted communication
   - Send a hash of all handshake messages — verifies handshake wasn't tampered with

8. **Application Data**: Now both sides can send encrypted data

**TLS 1.3 handshake** (modern, 1 round trip):

1. **Client Hello + Key Share**: Client sends DH key share for guessed cipher
2. **Server Hello + Key Share + Finished**: Server picks cipher, sends its key share, encrypted certificate, all in one shot
3. **Client Finished**: Client verifies, sends final
4. **Application Data**: Now flowing

Massive improvement: 1-RTT instead of 2-RTT. Also "0-RTT" mode for resumed sessions (with replay-attack risk).

**Key concepts**:

**Cipher suite**: Combination of:
- Key exchange algorithm (e.g., ECDHE)
- Authentication algorithm (e.g., RSA)
- Bulk encryption (e.g., AES-256-GCM)
- MAC algorithm (e.g., SHA-384)

Example: \`ECDHE-RSA-AES256-GCM-SHA384\` = Elliptic Curve DH + RSA auth + AES-256-GCM + SHA-384

**Certificate validation**:
- Chain of trust: server cert → intermediate → root CA
- Root CAs preinstalled in OS/browser
- Certificate signed by CA's private key; verified with CA's public key
- Hostname in SAN (Subject Alternative Name) must match requested hostname
- Not expired
- Not revoked (CRL or OCSP check)

**Forward secrecy** (PFS):
- Use ephemeral keys (ECDHE, DHE) — generated fresh per session
- If server's long-term private key is later compromised, past sessions stay secure
- TLS 1.3 mandates forward secrecy

**Session resumption**:
- Save session info to skip full handshake on reconnect
- Session IDs (TLS 1.2), session tickets, PSK (TLS 1.3)
- Reduces latency for repeated connections

## Real-World Example
**HTTPS to amazon.com**:
1. Browser → Amazon: ClientHello listing ciphers
2. Amazon → Browser: ServerHello + cert chain
3. Browser validates cert (Amazon's cert → DigiCert Intermediate → DigiCert Root)
4. Both compute session keys
5. Encrypted HTTP request flows

If certificate expired: browser shows "Your connection is not private" — handshake fails at validation.

**Let's Encrypt**: Free CA — automated cert issuance. Made HTTPS ubiquitous.

## Interview Tips
- TLS 1.2 = 2 RTT, TLS 1.3 = 1 RTT
- Forward secrecy via ephemeral keys
- Cipher suite components
- Certificate validation steps

## Common Follow-up Questions
1. What's forward secrecy? (Past sessions stay secure even if private key leaks later)
2. TLS 1.3 vs 1.2? (Faster, simpler, mandates PFS, removes weak ciphers)
3. What's SNI? (Server Name Indication — client tells server which hostname, enables virtual hosting)`,

    'Public Key Cryptography': `## Definition
**Public-key cryptography** (asymmetric cryptography) uses a pair of mathematically linked keys: a **public key** that can be freely shared, and a **private key** that must be kept secret. Anything encrypted with one can only be decrypted with the other. It enables secure communication between strangers and digital signatures.

## Why It Matters
Public-key crypto solves the fundamental problem: how do two people who've never met exchange a secret over a public channel? It's the foundation of HTTPS, SSH, signed software, cryptocurrencies — virtually all internet security.

## Detailed Explanation

**The two keys**:
- **Public key**: Shared with anyone. Used to encrypt messages TO you, or verify signatures FROM you.
- **Private key**: Never shared. Used to decrypt messages addressed to you, or to sign messages.

**Two main operations**:

**1. Encryption**:
- Sender uses receiver's PUBLIC key to encrypt
- Only the receiver's PRIVATE key can decrypt
- Use: send secret to someone you've never met

**2. Digital signature**:
- Signer uses their PRIVATE key to sign
- Anyone can verify with the signer's PUBLIC key
- Proves authorship and integrity (not faked, not modified)

**Common algorithms**:

**RSA** (Rivest-Shamir-Adleman, 1977):
- Based on difficulty of factoring large numbers
- Key sizes: 2048-bit minimum today, 4096-bit recommended
- Slower than ECC for equivalent security

**ECC** (Elliptic Curve Cryptography):
- Based on discrete log problem on elliptic curves
- 256-bit ECC ≈ 3072-bit RSA in security
- Faster, smaller keys, less battery — preferred for mobile/IoT
- Common curves: P-256, P-384, Curve25519

**Diffie-Hellman**: Key exchange (not encryption). Two parties derive a shared secret over public channel.

**Why asymmetric is slow**:
- Math operations (modular exponentiation) are expensive
- Typical use: encrypt a small RANDOM symmetric key with public key, then encrypt actual data with that symmetric key
- Hybrid encryption — best of both worlds

**Hybrid encryption** (real-world):
\`\`\`
1. Generate random AES key
2. Encrypt data with AES (fast, symmetric)
3. Encrypt AES key with recipient's RSA public key (small, asymmetric)
4. Send both
5. Recipient decrypts AES key with RSA private key
6. Recipient decrypts data with AES key
\`\`\`

**Digital signatures in detail**:
\`\`\`
Signing:
  hash = SHA256(message)
  signature = encrypt_with_private_key(hash)
  send(message, signature)

Verifying:
  hash = SHA256(message)
  decrypted = decrypt_with_public_key(signature)
  if hash == decrypted: valid
\`\`\`

**Public Key Infrastructure (PKI)**:
- Problem: how do I trust that this public key really belongs to amazon.com?
- Solution: Certificate Authorities (CAs) sign certificates binding identity → public key
- Browsers/OSes ship with trusted root CAs
- Chain of trust: cert → intermediate CA → root CA

**Use cases**:

| Use Case | How |
|----------|-----|
| HTTPS | Server has cert; client uses cert's public key to verify |
| SSH | Client's public key in server's authorized_keys |
| Code signing | Developer signs binary; OS verifies before running |
| Email (PGP/S/MIME) | Encrypt/sign email |
| Cryptocurrency | Public key = address; private key signs transactions |
| JWT (RS256) | Server signs token with private key; clients verify with public |

## Real-World Example
**SSH login**: 
1. Generate keypair: \`ssh-keygen\` produces \`id_rsa\` (private) and \`id_rsa.pub\` (public)
2. Copy public key to server: \`~/.ssh/authorized_keys\`
3. Login: server sends challenge, client signs with private key, server verifies with public key
4. No password needed, more secure

**Bitcoin transaction**:
- Your "address" is a hash of your public key
- To spend: sign the transaction with your private key
- Network verifies signature with your public key
- Proves you own the address

## Interview Tips
- Public encrypts → private decrypts (one direction)
- Private signs → public verifies (other direction)
- RSA vs ECC: ECC is modern, smaller, faster
- Hybrid encryption is real-world pattern
- PKI = how we know whose public key is whose

## Common Follow-up Questions
1. Why is hybrid encryption used? (Asymmetric is slow; use it just to exchange a symmetric key)
2. RSA vs ECC? (ECC: smaller keys, faster, equivalent security)
3. What's a CA? (Certificate Authority — trusted third party that signs public keys)`,

    'Symmetric vs Asymmetric Encryption': `## Definition
**Symmetric encryption** uses the same key for encryption and decryption — both parties must share this secret key. **Asymmetric encryption** (public-key) uses a key pair: a public key for encryption and a private key for decryption (or vice versa for signing). Each has different strengths and is used for different purposes in real systems.

## Why It Matters
Modern cryptosystems combine both: asymmetric for key exchange/signing, symmetric for bulk encryption. Understanding the trade-offs explains how HTTPS, VPNs, and encrypted messengers actually work.

## Detailed Explanation

**Symmetric encryption**:

**How it works**: Same key encrypts and decrypts. \`E(K, plaintext) = ciphertext\`, \`D(K, ciphertext) = plaintext\`.

**Common algorithms**:
- **AES** (Advanced Encryption Standard): The dominant standard. Block sizes 128-bit; key sizes 128/192/256-bit. Modes: GCM (with auth), CBC, CTR.
- **ChaCha20-Poly1305**: Modern stream cipher; faster on devices without AES hardware
- **DES, 3DES**: Legacy, broken/deprecated
- **RC4**: Legacy, broken

**Pros**:
- VERY fast (AES with hardware acceleration: gigabytes/second)
- Small ciphertext (no key overhead per block)
- Mature, well-understood

**Cons**:
- **Key distribution problem**: How do you share the key securely with someone you've never met?
- All users need a shared key — N users need N(N-1)/2 keys for full mesh
- No identity (just possession of key)

**Asymmetric encryption**:

**How it works**: Key pair — public key encrypts, private key decrypts (or signing pair: private signs, public verifies).

**Common algorithms**:
- **RSA**: Based on factoring; 2048+ bit keys
- **ECC** (Elliptic Curve): Modern, smaller keys (256-bit ≈ RSA 3072-bit)
- **Diffie-Hellman**: Key exchange (not encryption)

**Pros**:
- Solves key distribution: anyone can know your public key
- Enables digital signatures
- Supports identity (your private key = your identity)

**Cons**:
- 1000-10000× slower than symmetric
- Larger ciphertext (encryption overhead per block)
- Limited message size (can't encrypt huge data directly)

**Comparison table**:

| Aspect | Symmetric | Asymmetric |
|--------|-----------|------------|
| Keys | One shared | Pair (public + private) |
| Speed | Very fast | Slow |
| Key distribution | Hard problem | Solved (publish public key) |
| Use for | Bulk data encryption | Key exchange, signatures |
| Algorithms | AES, ChaCha20 | RSA, ECC |
| Key sizes (typical) | 128-256 bit | 2048+ bit RSA / 256+ bit ECC |
| Identity | None (just key possession) | Yes (private key = identity) |

**Hybrid encryption** (how real systems work):
1. Generate random symmetric key (e.g., AES-256 key)
2. Encrypt actual data with that symmetric key (fast)
3. Encrypt the symmetric key with recipient's public key (small payload)
4. Send both
5. Recipient: decrypt symmetric key with private key, then decrypt data with symmetric key

This is what TLS, PGP, S/MIME, and basically every secure protocol does.

**TLS handshake = hybrid in action**:
- ECDHE asymmetric key exchange → derive shared secret
- All subsequent data encrypted with AES-GCM or ChaCha20-Poly1305 (symmetric)

## Real-World Example
**HTTPS**: TLS handshake uses RSA/ECC (asymmetric) to exchange keys. Once session keys derived, ALL HTTP data is encrypted with AES-GCM (symmetric). Result: secure AND fast.

**Signal Protocol** (used by WhatsApp, Signal): Combines X3DH (asymmetric key exchange) with Double Ratchet (symmetric forward-secure messaging). Hybrid system.

**Bitcoin**: Public/private keypairs identify wallets. But internally, transaction data is mostly hashed/encoded — no encryption needed (it's all public).

## Interview Tips
- "Asymmetric for key exchange + signing; symmetric for bulk data" is the headline
- Hybrid encryption is the real-world answer
- AES + RSA combo is the typical pairing
- Speed difference is huge — orders of magnitude

## Common Follow-up Questions
1. Why use both? (Asymmetric solves distribution; symmetric is fast for bulk data)
2. Why is symmetric faster? (Simpler math operations, hardware-accelerated)
3. What's AES-GCM? (Authenticated encryption — confidentiality + integrity)`,
    'MAC vs IP Address': `## Definition
A **MAC (Media Access Control) address** is a 48-bit hardware identifier burned into network interfaces (Layer 2). An **IP address** is a logical address assigned by software (Layer 3). MAC addresses identify devices on a local network segment; IP addresses identify devices across the entire internet.

## Why It Matters
The MAC/IP distinction is fundamental to how networking works — local delivery vs global routing. Understanding both clarifies how packets actually move from your laptop to a server across the world.

## Detailed Explanation

**MAC address**:
- 48 bits (6 bytes), written as \`AA:BB:CC:DD:EE:FF\`
- First 24 bits = manufacturer (OUI — Organizationally Unique Identifier)
- Last 24 bits = device-specific
- Globally unique (in theory)
- Burned into NIC (Network Interface Card) at manufacture
- Can be spoofed/changed in software

**IP address**:
- IPv4: 32 bits, written as \`192.168.1.5\`
- IPv6: 128 bits, written as \`2001:db8::1\`
- Logical, assigned by network admin or DHCP
- Globally routable (public IPs) or private (NAT)
- Can change (laptop on different networks gets different IPs)

**Layer comparison**:

| Aspect | MAC | IP |
|--------|-----|-----|
| OSI Layer | 2 (Data Link) | 3 (Network) |
| Scope | Local network segment | Global internet |
| Format | 48 bits hex | 32 (IPv4) / 128 (IPv6) bits |
| Set by | Hardware (NIC) | Software/DHCP |
| Used for | Frame delivery on LAN | Packet routing across networks |
| Changes | Stays with NIC | Changes per network |
| Example | \`00:1A:2B:3C:4D:5E\` | \`192.168.1.1\` |

**How they work together** (sending a packet to google.com):
1. DNS: google.com → 142.250.80.46 (IP)
2. Routing: which next hop to send to? Look up routing table.
3. ARP: if next hop is on local network, what's its MAC? \`192.168.1.1 → AA:BB:CC:DD:EE:FF\`
4. Construct frame: \`Src MAC: my MAC, Dst MAC: router MAC, Src IP: my IP, Dst IP: 142.250.80.46\`
5. Send frame on local wire/Wi-Fi
6. Router receives, sees its MAC matches → process IP layer
7. Router looks up routing → forwards to next hop with NEW MAC addresses (router's outbound MAC, next hop's MAC)
8. IP addresses stay the same end-to-end; MAC addresses change every hop

**Key insight**: MAC addresses are LOCAL — they change every router hop. IP addresses are END-TO-END — they stay the same.

**ARP (Address Resolution Protocol)**: Bridges layers — given an IP on the local network, find the MAC.

**MAC spoofing**: Tools can change software-reported MAC address. Used legitimately (privacy on public Wi-Fi) and illegitimately (bypassing MAC-based access control).

**IPv4 exhaustion** birthed NAT, IPv6, dynamic IPs. MAC addresses haven't faced similar pressure (way more bits available).

## Real-World Example
**Wi-Fi captive portal**: Coffee shop tracks devices by MAC address (you can't just change your IP via DHCP to bypass time limits — your MAC is "remembered"). Privacy-conscious users randomize their MAC.

**Home network**: Router has a public IP from ISP and an internal IP \`192.168.1.1\`. Each device has its own internal IP and MAC. Internet sees only the router's MAC and IP; internally, devices identified by MAC + assigned IP.

## Interview Tips
- MAC = Layer 2 = local; IP = Layer 3 = global
- IP stays end-to-end; MAC changes every hop
- ARP bridges them
- Both can be spoofed but for different reasons

## Common Follow-up Questions
1. Why two addresses? (Different scopes — local delivery vs global routing)
2. What's ARP? (Maps IP → MAC on local network)
3. Why MAC at all if IP works? (LANs predate IP; Layer 2 is needed for local switching)`,

    'ARP': `## Definition
**ARP (Address Resolution Protocol)** is the protocol used to map an IP address to a MAC address on a local network segment. When a device wants to send a packet to another device on its LAN, it uses ARP to discover the recipient's MAC address from its IP address.

## Why It Matters
ARP is invisible but essential — every packet on a LAN involves an ARP lookup. ARP-related issues (cache poisoning, spoofing) are common attack vectors. Understanding ARP debugs many network problems.

## Detailed Explanation

**The problem ARP solves**:
- You want to send a packet to \`192.168.1.5\` on your local network
- Ethernet needs the destination MAC address in the frame header
- You only have the IP address — how do you get the MAC?

**The ARP protocol**:

1. **ARP Request** (broadcast):
   - Source: my MAC + my IP
   - Destination MAC: \`FF:FF:FF:FF:FF:FF\` (broadcast to all)
   - Question: "Who has IP 192.168.1.5? Tell me your MAC"

2. **ARP Reply** (unicast):
   - The owner of 192.168.1.5 responds: "It's me. My MAC is AA:BB:CC:DD:EE:FF"
   - Sent directly to the requester

3. **ARP cache**:
   - Responses cached locally to avoid repeated lookups
   - Entries expire (typically 5-20 minutes)
   - View: \`arp -a\` (Linux/Mac/Windows)

**ARP cache example**:
\`\`\`
$ arp -a
192.168.1.1     (router)        00:11:22:33:44:55  ether  eth0
192.168.1.10    (printer)       AA:BB:CC:DD:EE:FF  ether  eth0
\`\`\`

**ARP only works on the local network segment**. To send to a host on another network, you ARP-resolve your default gateway's MAC, send the frame to the gateway, and it forwards.

**ARP spoofing / poisoning** (man-in-the-middle attack):
1. Attacker sends fake ARP replies to victim: "I'm 192.168.1.1 (the gateway), my MAC is X (attacker's MAC)"
2. Victim's ARP cache poisoned
3. Victim sends all traffic destined for the gateway to the attacker
4. Attacker forwards to real gateway, capturing/modifying along the way

**Mitigations**:
- Static ARP entries for critical hosts
- Dynamic ARP Inspection (DAI) on managed switches
- Encryption everywhere (HTTPS makes ARP spoofing yield encrypted traffic, mostly useless)

**Variants**:

**Gratuitous ARP**: Device announces "I am 192.168.1.5, my MAC is X" without being asked. Used for:
- Updating others' caches when MAC changes (failover, IP migration)
- Detecting IP conflicts

**Reverse ARP (RARP)**: MAC → IP lookup. Used by diskless workstations at boot. Largely replaced by DHCP.

**ARP for IPv6 = NDP**:
- Neighbor Discovery Protocol replaces ARP in IPv6
- Uses ICMPv6 instead of separate protocol
- Adds router discovery, address autoconfig

## Real-World Example
**Pinging a local device**:
1. \`ping 192.168.1.5\` — first time
2. OS checks ARP cache: not found
3. ARP request broadcast: "Who has 192.168.1.5?"
4. Device replies: "Me, MAC AA:BB:CC..."
5. OS caches the entry
6. ICMP echo request sent in Ethernet frame to that MAC
7. Reply comes back; first ping shows higher latency (ARP overhead), subsequent pings faster

**Debugging "host unreachable"**: Often \`arp -a\` shows incomplete entry — ARP not resolving. Check that the IP is on the same subnet, that the host is up, that no ARP filtering is happening.

## Interview Tips
- ARP request = broadcast; ARP reply = unicast
- ARP cache makes repeated lookups fast
- Spoofing is a classic MITM attack
- IPv6 uses NDP, not ARP

## Common Follow-up Questions
1. What's gratuitous ARP? (Unsolicited announcement — used for failover, conflict detection)
2. ARP spoofing? (Send fake replies to poison caches → MITM)
3. What's NDP? (IPv6's replacement for ARP, broader functionality)`,

    'Routing Algorithms': `## Definition
**Routing algorithms** determine the path packets take through a network from source to destination. They're used by routers to populate their routing tables, dynamically adapting to topology changes, link failures, and congestion. The two major families are distance-vector and link-state.

## Why It Matters
Routing is what makes the internet "internet" — packets find their way across thousands of networks. Understanding routing protocols explains how the internet self-heals from failures and how providers exchange traffic.

## Detailed Explanation

**Static vs dynamic routing**:
- **Static**: Manually configured routes. Simple, no overhead, but doesn't adapt.
- **Dynamic**: Routers exchange info to learn paths automatically.

**Two main algorithm families**:

**1. Distance-Vector (Bellman-Ford-based)**:
- Each router knows distance (hops/cost) to each destination via each neighbor
- Periodically share full routing table with direct neighbors
- "Routing by rumor" — believe what neighbors say
- Examples: RIP (Routing Information Protocol), EIGRP

**Pros**: Simple, low memory.
**Cons**: Slow convergence (count-to-infinity problem), routing loops.

**2. Link-State (Dijkstra-based)**:
- Each router floods info about its DIRECT links to ALL routers
- Every router builds complete topology graph
- Each computes shortest path independently using Dijkstra
- Examples: OSPF (Open Shortest Path First), IS-IS

**Pros**: Fast convergence, no loops, supports complex topologies.
**Cons**: More memory/CPU, more bandwidth for flooding.

**Comparison**:

| Aspect | Distance-Vector | Link-State |
|--------|-----------------|------------|
| What's shared | Routing table | Link info |
| To whom | Direct neighbors only | All routers (flooded) |
| Convergence | Slow | Fast |
| Memory | Low | Higher (full topology) |
| CPU | Low | Higher (Dijkstra) |
| Loop risk | Yes (count to infinity) | No |
| Examples | RIP, EIGRP | OSPF, IS-IS |

**3. Path-Vector (BGP)**:
- Used between Autonomous Systems (different ISPs/orgs)
- Carries full path of ASes a route traverses
- Policy-based (not just shortest path) — prefer routes from customers, avoid certain transits
- Example: BGP (Border Gateway Protocol) — runs the internet

**Common protocols**:

| Protocol | Type | Scope |
|----------|------|-------|
| RIP | Distance-vector | Small networks |
| EIGRP | Hybrid (Cisco) | Enterprise |
| OSPF | Link-state | Within an organization (IGP) |
| IS-IS | Link-state | ISP backbones |
| BGP | Path-vector | Between ISPs (EGP) |

**Dijkstra's algorithm** (used by link-state):
- Find shortest path tree from source
- O((V+E) log V) with priority queue
- Foundation of OSPF route computation

**Routing metrics**:
- **Hop count** (RIP): Simple, ignores link quality
- **Bandwidth/delay** (OSPF, EIGRP): Better routes
- **Cost** (administrative): Custom metrics for policy

## Real-World Example
**ISP backbone**: Tier-1 ISPs run BGP between each other and OSPF/IS-IS internally. When a fiber cut occurs, OSPF reconverges in seconds — packets reroute around the break. BGP between ISPs propagates outage info more slowly (tens of seconds to minutes).

**Internet-scale routing**: There are ~70,000 ASes (Autonomous Systems) on the internet. BGP connects them. Routing table size: ~900,000+ IPv4 prefixes (and growing).

## Interview Tips
- Distance-vector vs link-state is the classic distinction
- BGP is special (path-vector, between ASes)
- Dijkstra's = link-state algorithm
- Convergence time is a key practical concern

## Common Follow-up Questions
1. Why is BGP path-vector? (Carries full AS path → loop avoidance + policy decisions)
2. Why is link-state faster to converge? (Each router has full topology — no rumor propagation)
3. What runs between ISPs? (BGP — policy-aware routing for inter-AS)`,

    'Subnetting': `## Definition
**Subnetting** is the practice of dividing a single IP network into smaller logical subnetworks (subnets). It uses a subnet mask to indicate which portion of an IP address represents the network and which represents the host. Subnetting enables efficient address use, network segmentation, and security isolation.

## Why It Matters
Subnetting is core to network engineering — required for designing networks, configuring routers, and reading IP configurations. AWS VPCs, Kubernetes pod networks, home routers — all use subnetting concepts.

## Detailed Explanation

**The basics**:
- IPv4 address: 32 bits (e.g., \`192.168.1.5\`)
- Subnet mask: defines how many bits are "network" vs "host"
- CIDR notation: \`192.168.1.0/24\` — the /24 means first 24 bits are network

**Network/host split**:
\`\`\`
192.168.1.5/24
Binary: 11000000.10101000.00000001.00000101
Mask:   11111111.11111111.11111111.00000000  (/24)
        |---- network ----|---host---|
\`\`\`
- Network: \`192.168.1.0\`
- Host: \`5\`
- All hosts in this subnet: \`192.168.1.0\` to \`192.168.1.255\`

**Special addresses in each subnet**:
- **Network address**: All host bits 0 (e.g., \`192.168.1.0\`) — cannot be assigned
- **Broadcast address**: All host bits 1 (e.g., \`192.168.1.255\`) — broadcasts to all hosts in subnet
- **Usable hosts**: 2^(host bits) - 2 (subtract network and broadcast)

**Common subnets**:

| CIDR | Mask | Total IPs | Usable Hosts |
|------|------|-----------|--------------|
| /8 | 255.0.0.0 | 16,777,216 | 16,777,214 |
| /16 | 255.255.0.0 | 65,536 | 65,534 |
| /24 | 255.255.255.0 | 256 | 254 |
| /27 | 255.255.255.224 | 32 | 30 |
| /30 | 255.255.255.252 | 4 | 2 (point-to-point links) |
| /32 | 255.255.255.255 | 1 | 1 (single host) |

**Subnetting** = taking a larger network and dividing it:

\`192.168.0.0/16\` (65,536 addresses) can be split into:
- 256 subnets of /24 (256 each)
- 16 subnets of /20 (4096 each)
- Etc.

**Example**: Your company has \`10.0.0.0/16\`. You want 4 departments, each with their own subnet.
- 4 subnets needs 2 bits (\`2^2 = 4\`)
- Each subnet is /18 (16 + 2 = 18 network bits)
- Subnets:
  - \`10.0.0.0/18\` (16,384 hosts)
  - \`10.0.64.0/18\`
  - \`10.0.128.0/18\`
  - \`10.0.192.0/18\`

**Private IP ranges** (RFC 1918):
- \`10.0.0.0/8\` (16M addresses)
- \`172.16.0.0/12\` (1M addresses)
- \`192.168.0.0/16\` (65K addresses)

**Why subnet?**
1. **Efficient address use**: Don't waste a /16 on a 50-host office
2. **Security isolation**: Different subnets = enforce firewall rules between them
3. **Broadcast domains**: Smaller subnets = less broadcast traffic
4. **Routing organization**: Hierarchical structure simplifies routing tables

**VLSM (Variable Length Subnet Mask)**:
- Different subnet sizes for different needs
- Branch office (200 users) → /24
- Server segment (10 servers) → /28
- Point-to-point WAN link → /30

**Supernetting / CIDR aggregation**:
- Combine multiple subnets into a single advertisement
- \`192.168.0.0/24\` + \`192.168.1.0/24\` + ... + \`192.168.255.0/24\` = \`192.168.0.0/16\`
- Reduces routing table size (especially in BGP)

## Real-World Example
**AWS VPC**: Create VPC with \`10.0.0.0/16\`. Subdivide:
- Public subnet (web servers): \`10.0.1.0/24\` (256 IPs)
- Private subnet (app servers): \`10.0.2.0/24\`
- DB subnet: \`10.0.3.0/24\`

Security groups + NACLs control traffic between them. Public subnet has Internet Gateway; private subnets reach internet via NAT Gateway.

**Home router**: Default subnet is usually \`192.168.0.0/24\` or \`192.168.1.0/24\` — 254 usable IPs for your devices.

**Kubernetes**: Pod CIDR \`10.244.0.0/16\` — each node gets a /24, pods on that node get IPs from it.

## Interview Tips
- Memorize CIDR sizes (/24 = 254 hosts is the most common)
- Network address (.0) and broadcast (.255) reserved
- Private ranges (10/8, 172.16/12, 192.168/16)
- VLSM for efficient allocation

## Common Follow-up Questions
1. Why subtract 2 for usable hosts? (Network address and broadcast not assignable)
2. What's CIDR? (Classless Inter-Domain Routing — flexible subnet sizes via /N notation)
3. What's the difference between subnet mask and prefix length? (Same info, different notation: 255.255.255.0 = /24)`,

    'BGP': `## Definition
**Border Gateway Protocol (BGP)** is the routing protocol that exchanges routing information between Autonomous Systems (ASes) on the internet. It's the protocol that "runs the internet" — every ISP uses it to tell others which IP prefixes they can deliver to. BGP is path-vector (carries full AS path) and policy-based.

## Why It Matters
BGP is the spinal cord of the internet. BGP outages cause global incidents (Facebook 2021, Cloudflare 2019). Understanding BGP is essential for network engineering, cloud architecture, and incident response.

## Detailed Explanation

**Autonomous System (AS)**:
- A network under single administrative control
- Each has an AS number (ASN), e.g., AS15169 (Google), AS32934 (Facebook)
- Internet has ~70,000 ASes

**BGP basics**:
- Runs over TCP port 179
- Two routers establish a "BGP session"
- Exchange "UPDATE" messages: route announcements + withdrawals
- Route info: prefix + AS path + attributes

**iBGP vs eBGP**:
- **eBGP (External)**: Between routers in different ASes. Used to learn external routes.
- **iBGP (Internal)**: Between routers within same AS. Distributes external routes inside.

**BGP route example**:
\`\`\`
Prefix: 8.8.8.0/24
AS Path: 32934 → 6939 → 15169
Next Hop: 192.0.2.1
Origin: IGP
\`\`\`
"To reach 8.8.8.0/24, go via AS 32934, which goes via AS 6939, which goes via AS 15169 (Google)."

**Path attributes** (used for path selection):
1. **AS Path**: List of ASes traversed (shorter usually preferred)
2. **Local Preference**: Outbound preference within an AS
3. **MED (Multi-Exit Discriminator)**: Suggests preferred entry point
4. **Origin**: How route was learned (IGP, EGP, incomplete)
5. **Communities**: Tags for policy (e.g., "don't export to peers")

**BGP route selection** (best path):
1. Highest local preference
2. Shortest AS path
3. Lowest origin code (IGP < EGP < incomplete)
4. Lowest MED
5. eBGP > iBGP
6. Lowest IGP cost to next hop
7. Lowest router ID (tiebreaker)

**Policy and business**:
- ISPs sell transit, peer with each other, customers buy transit
- BGP doesn't pick "shortest" path — picks "best for business" path
- Common rule: "prefer customers > peers > providers" (for revenue)

**Loop prevention**:
- AS path attribute — if your own AS appears in the path, reject the route
- Built-in to path-vector design

**BGP convergence**:
- Slower than IGPs (OSPF/IS-IS) — minutes, not seconds
- Designed for stability over speed (avoid flapping)
- Internet routing tables: ~900,000+ IPv4 prefixes

**Famous BGP incidents**:

**1. Pakistan Telecom blocks YouTube (2008)**: Pakistan's ISP intentionally blackholed YouTube traffic. Misconfigured BGP announcement leaked globally — YouTube down worldwide for hours.

**2. Facebook outage (October 2021)**: Internal BGP misconfiguration withdrew Facebook's prefixes from the internet. Even Facebook employees couldn't enter offices (badge system on the same network). 6+ hours global outage.

**3. China Telecom (2010)**: 15% of internet traffic briefly routed through China for 18 minutes — likely accidental but suspicious.

**Security issues**:
- BGP has minimal authentication — anyone can announce anyone's prefix
- **Route hijacking**: Announce someone else's IPs to intercept their traffic
- **RPKI (Resource Public Key Infrastructure)**: Cryptographic validation of legitimate origin AS
- **BGPsec**: Path validation (limited deployment)

## Real-World Example
**Cloudflare connecting to ISPs**: Cloudflare AS13335 peers with thousands of ISPs via BGP. When you connect to a Cloudflare-hosted site, BGP determines which Cloudflare PoP your packets reach (anycast routing).

**Anycast DNS** (e.g., 1.1.1.1, 8.8.8.8): Same IP announced from multiple locations via BGP. Each user routed to nearest. BGP handles the "geographic load balancing" automatically.

## Interview Tips
- "BGP runs the internet between ISPs"
- Path-vector with policy
- Slow convergence (designed for stability)
- Mention famous outages — shows real-world awareness
- RPKI is a modern security topic

## Common Follow-up Questions
1. eBGP vs iBGP? (External between ASes, internal within an AS)
2. Why path-vector? (Loop avoidance + policy decisions via AS path)
3. What's RPKI? (Cryptographic mechanism to validate route origin — prevents hijacking)`,
    'Network Topology': `## Definition
**Network topology** is the physical or logical arrangement of devices and connections in a network. It describes how nodes are connected to each other and how data flows between them. Common topologies include bus, star, ring, mesh, tree, and hybrid combinations.

## Why It Matters
Topology affects fault tolerance, performance, cost, and complexity. Understanding topologies helps in designing networks, analyzing failure modes, and choosing appropriate architectures for different scenarios.

## Detailed Explanation

**Common topologies**:

**1. Bus topology**:
- All devices connected to a single shared cable (backbone)
- Data broadcast to all; only intended recipient processes
- Old Ethernet (10BASE2, 10BASE5)
- Pros: Simple, cheap, less cabling
- Cons: Single point of failure (cable break = network down), collisions, hard to troubleshoot
- Mostly obsolete

**2. Star topology**:
- All devices connect to a central hub/switch
- Hub broadcasts (old) or switch routes (modern)
- DOMINANT topology today (Ethernet via switches, Wi-Fi APs)
- Pros: Failures isolated, easy to add/remove devices, centralized management
- Cons: Hub/switch is single point of failure, more cabling

**3. Ring topology**:
- Devices connected in a circular chain
- Data passes from one to next until it reaches destination
- Token Ring (legacy), FDDI, some industrial networks
- Pros: Predictable performance (no collisions), equal access
- Cons: Single break can disable ring, harder to add devices

**4. Mesh topology**:
- Devices connect to multiple other devices
- **Full mesh**: every device connects to every other
- **Partial mesh**: critical devices have multiple connections
- Used in WAN backbones, wireless mesh networks (e.g., LoRaWAN, smart-home Zigbee)
- Pros: Redundancy, fault tolerance, multiple paths
- Cons: Expensive (many connections), complex routing

**5. Tree (hierarchical) topology**:
- Star-of-stars — root switch with branch switches
- Common in enterprise networks
- Core / Distribution / Access layers
- Pros: Scales well, structured
- Cons: Root failure affects below

**6. Hybrid**:
- Combination of multiple topologies
- Most real networks are hybrids
- E.g., star-of-stars (tree) for office; full mesh between data centers

**Modern data center topologies**:

**Three-tier (legacy)**: Core / Aggregation / Access. Tree-like.

**Spine-Leaf** (modern):
- Two layers: spine switches and leaf switches
- Every leaf connects to every spine (full mesh between layers)
- Predictable latency (any-to-any: 2 hops)
- Used in modern data centers (Facebook, Google) for east-west traffic

**Fat-tree** (Clos network):
- Multi-stage switching with redundant paths
- Used in supercomputers, large data centers

**Comparison table**:

| Topology | Cost | Reliability | Scalability | Performance |
|----------|------|-------------|-------------|-------------|
| Bus | Low | Poor | Poor | Poor |
| Star | Medium | Good | Good | Good |
| Ring | Medium | Poor | Medium | Predictable |
| Mesh | High | Excellent | Poor | Excellent |
| Tree | Medium | Medium | Good | Good |
| Spine-Leaf | High | Excellent | Excellent | Excellent |

## Real-World Example
**Home network**: Star topology — devices connect to Wi-Fi router (access point + switch). Router fails, network down. Devices fail, others unaffected.

**Internet**: Mesh-of-trees. Within ISPs, hierarchical. Between ISPs, mesh (BGP peering). No single point of failure.

**Hyperscale data centers** (Facebook, Google): Spine-leaf or fat-tree. Tens of thousands of servers, predictable latency, massive bisection bandwidth.

## Interview Tips
- Star is dominant today (switches, Wi-Fi APs)
- Mesh = redundancy at cost
- Spine-leaf is modern data center answer
- Real networks are hybrids

## Common Follow-up Questions
1. Why is star most common? (Simple, isolated failures, cheap switches)
2. Why spine-leaf in data centers? (Predictable any-to-any latency for east-west traffic)
3. When use mesh? (When redundancy is critical — backbones, military, industrial)`,

    'Packet Switching vs Circuit Switching': `## Definition
**Circuit switching** establishes a dedicated path between endpoints for the duration of communication — the path is reserved exclusively. **Packet switching** breaks data into small packets that traverse the network independently, sharing links with other traffic. The internet is packet-switched; traditional telephone networks were circuit-switched.

## Why It Matters
This distinction explains why the internet works the way it does — efficient sharing, but variable latency. Understanding both clarifies the trade-offs in modern network design and the historical evolution of telecom.

## Detailed Explanation

**Circuit switching**:
- **Setup phase**: Path established end-to-end (signaling)
- **Data phase**: All data flows along this path with reserved bandwidth
- **Teardown phase**: Resources released
- Like making a phone call: dial → connect → talk → hang up

**Examples**:
- Traditional landline phones (PSTN)
- ISDN
- SONET/SDH backbones (transport circuits)
- Some military communications

**Packet switching**:
- Data broken into packets (typically ~1500 bytes for Ethernet)
- Each packet has source/destination address
- Each packet routed independently — may take different paths
- Routers share links among many flows
- No setup; just send

**Examples**:
- The Internet (IP)
- Ethernet
- Modern cellular data (LTE, 5G)
- VoIP

**Comparison**:

| Aspect | Circuit Switching | Packet Switching |
|--------|-------------------|-------------------|
| Setup | Yes (dedicated path) | No |
| Bandwidth | Reserved per call | Shared among many |
| Latency | Predictable, low | Variable |
| Efficiency | Low (idle time wasted) | High (statistical multiplexing) |
| Reliability | Path can fail mid-call | Reroutes around failures |
| Use case | Voice (steady stream) | Bursty data (web, files) |
| Billing | Time-based (per minute) | Volume-based (per GB) |

**Packet switching variants**:

**1. Datagram (connectionless)**:
- Each packet independent, may take different paths
- IP, UDP
- More resilient to failures

**2. Virtual circuit (connection-oriented)**:
- Logical path established (but physical resources still shared)
- Packets follow same path, in order
- ATM, MPLS, X.25
- Combines aspects of both paradigms

**Why packet switching won**:

**1. Bursty data**: Web, email, file transfers send data in bursts with idle gaps. Reserving bandwidth wastes resources.

**2. Resilience**: ARPANET (precursor to internet) designed to survive attacks — packets reroute around failures.

**3. Efficiency**: Statistical multiplexing — many flows share links, average usage well below peak.

**4. Cost**: One shared infrastructure for everything (voice, video, data) — cheaper than separate circuit networks.

**Cellular evolution**:
- 2G (GSM): Circuit-switched voice + packet-switched data (slow)
- 3G: Both circuit and packet
- 4G LTE: Pure packet-switched (voice over IP, called VoLTE)
- 5G: Pure packet, even more flexible

**Why circuit switching persists**:

**1. Predictable latency**: Critical for voice, video conferencing — packet-switched needs QoS to approximate this.

**2. Guaranteed bandwidth**: Reserved circuit guarantees capacity; packet shares.

**3. Simple billing**: "Per minute" easy to charge.

**4. Some legacy networks** still use it (mostly being phased out).

## Real-World Example
**Old landline telephone**: When you called your grandma, the phone company allocated a dedicated 64 kbps circuit between your house and hers, going through multiple switches. Reserved for the entire call, even during silence. Tied up resources but had perfect quality.

**Modern VoIP (Zoom, Teams, etc.)**: Audio packetized into UDP packets. Packets cross internet, sharing bandwidth with millions of other flows. Quality variable (jitter, packet loss) but uses far less infrastructure for the same number of calls.

## Interview Tips
- Internet = packet-switched (the canonical answer)
- Phone (legacy) = circuit-switched
- Packet switching = better for bursty data + resilience
- Circuit switching = better for predictable latency

## Common Follow-up Questions
1. Why is internet packet-switched? (Efficiency for bursty data, resilience, sharing)
2. What's statistical multiplexing? (Sharing capacity based on average use, not peak)
3. Are there hybrid approaches? (MPLS, ATM virtual circuits — packet switching with circuit-like properties)`,

    'Bandwidth vs Latency': `## Definition
**Bandwidth** is the maximum amount of data that can be transmitted per unit time (e.g., Mbps, Gbps) — how WIDE the pipe is. **Latency** is the time it takes for data to travel from source to destination (e.g., ms) — how FAST the pipe responds. They're independent dimensions; high bandwidth doesn't imply low latency.

## Why It Matters
Confusing the two leads to wrong assumptions about network performance. Understanding the difference is essential for designing systems, choosing CDNs, and debugging "slow internet" complaints.

## Detailed Explanation

**The pipe analogy**:
- Bandwidth = pipe diameter (how much water per second)
- Latency = pipe length (how long for first drop to arrive)
- They're separate — fat short pipe vs thin long pipe

**Bandwidth**:
- Measured in bits per second: Mbps, Gbps
- Maximum theoretical capacity
- Often "advertised" speed (your ISP plan)
- Examples:
  - Home Wi-Fi: 100-1000 Mbps
  - Fiber to home: 1+ Gbps
  - Backbone: 100s of Gbps to Tbps
  - Mobile 5G: hundreds of Mbps

**Latency** (one-way) and **RTT** (round-trip time):
- Measured in milliseconds (ms) or microseconds
- "Ping time" usually means RTT
- Examples:
  - Within a city: ~5-10 ms RTT
  - Across continent (US coast-to-coast): ~70 ms RTT
  - Across ocean (US-EU): ~80-150 ms RTT
  - To geosynchronous satellite: ~600 ms RTT
  - Local LAN: <1 ms

**Latency components**:
- **Propagation delay**: Speed-of-light limit (≈200,000 km/s in fiber)
- **Transmission delay**: Time to push bits out of NIC (related to bandwidth)
- **Processing delay**: Each hop processes packets
- **Queuing delay**: Packets wait in router queues (varies with load)

**The relationship**:

\`\`\`
Throughput ≤ Bandwidth
Throughput ≈ Window Size / RTT  (for TCP)
\`\`\`

For TCP: small window + high RTT = low throughput EVEN with high bandwidth.

**Bandwidth-Delay Product (BDP)**:
- Amount of data "in flight" at any moment = Bandwidth × RTT
- Long-haul, high-bandwidth links have huge BDPs (gigabytes!)
- TCP needs large windows to fill the pipe

**The "fat long pipe" problem**:
- 1 Gbps link, 100ms RTT → BDP = 12.5 MB
- Default TCP window (64 KB) → throughput = 64KB/100ms = 640 KB/s — far below 1 Gbps!
- Need TCP window scaling to use full bandwidth

**Common confusions**:

**1. "More bandwidth = faster web pages"**: Partially true. After a certain point, web page load time is latency-bound (small files, many requests). Going from 100 Mbps to 1 Gbps barely improves browsing.

**2. "Latency improvements don't matter if bandwidth is high"**: Wrong. High latency limits TCP throughput, slows handshakes, hurts interactive apps.

**3. "Speed test = my actual experience"**: Speed tests measure peak throughput; real-world apps care about latency, packet loss, jitter.

**Latency-sensitive vs bandwidth-sensitive workloads**:

| Workload | Sensitive to |
|----------|--------------|
| Streaming video | Bandwidth |
| File downloads | Bandwidth |
| Web browsing | Both (but latency dominant for small pages) |
| Online gaming | Latency (low ping) |
| Video conferencing | Latency + jitter (>bandwidth) |
| Stock trading | Latency (microseconds matter) |
| Database queries | Latency (round trips) |

**Improving latency**:
- Geographic distribution (CDNs)
- Edge computing (run code closer to user)
- HTTP/2, HTTP/3 (multiplexed connections, fewer round trips)
- Caching (avoid round trip entirely)
- Content prefetching

**Improving bandwidth**:
- Faster links (10G, 100G)
- Multiple connections in parallel
- Compression (transmit less data)

## Real-World Example
**Watching a YouTube video**:
- Bandwidth-bound: video streaming needs ~5 Mbps for 1080p. If your bandwidth is 1 Mbps, video constantly buffers.
- Latency-bound: clicking on the video — high latency means delay before playback starts.

**Stock market**: HFT firms pay millions for microseconds of latency improvement (shorter cables, FPGAs, colocation in exchange data center). Bandwidth is plentiful; latency is the bottleneck.

**Gaming**: 10 Mbps is plenty bandwidth-wise. But 100ms ping makes you uncompetitive in FPS games. Counterintuitively, fiber from across the world is worse than slower internet locally.

## Interview Tips
- "Bandwidth = pipe width, latency = pipe length" — memorable analogy
- Bandwidth-Delay Product is a great term to drop
- CDNs solve latency, not bandwidth
- Speed-of-light is the absolute lower bound on latency

## Common Follow-up Questions
1. Why doesn't more bandwidth always help? (Latency dominates for small data, RTT-bound apps)
2. Speed-of-light limit? (~67ms RTT around the world; can't beat physics)
3. How does CDN help? (Reduces latency by serving from nearby edge — bandwidth same)`,

    'Throughput': `## Definition
**Throughput** is the actual rate of successful data transfer over a network or system, measured in bits/second or operations/second. It's distinct from bandwidth (theoretical max) and is affected by latency, packet loss, protocol overhead, and other factors.

## Why It Matters
Throughput is what you ACTUALLY get — what users experience. Designing for high throughput requires understanding the gap between bandwidth (capacity) and throughput (delivered performance), and the bottlenecks in between.

## Detailed Explanation

**Throughput vs Bandwidth**:
- **Bandwidth**: Theoretical capacity (e.g., "1 Gbps link")
- **Throughput**: Actual achieved rate (e.g., "got 800 Mbps in practice")
- Throughput ≤ Bandwidth, often significantly less
- Real-world throughput depends on protocols, contention, loss, and tuning

**TCP throughput formula** (Mathis, simplified):
\`\`\`
Throughput ≈ MSS / (RTT × √loss)
\`\`\`
Where:
- MSS = Maximum Segment Size (~1460 bytes)
- RTT = Round-Trip Time
- loss = packet loss probability

**Implications**:
- High RTT or any packet loss massively reduces throughput
- Doubling RTT halves throughput
- Even tiny packet loss has big impact

**TCP throughput formula** (window-based):
\`\`\`
Throughput = Window Size / RTT
\`\`\`
- Default window 64 KB, RTT 100 ms → max ~640 KB/s
- Fix: TCP window scaling (RFC 1323) → larger windows → higher throughput

**Bandwidth-Delay Product (BDP)**:
- = Bandwidth × RTT
- Amount of "in-flight" data needed to keep pipe full
- 1 Gbps × 100 ms = 12.5 MB
- TCP window must be ≥ BDP to fully use bandwidth

**Common throughput killers**:

**1. Small TCP windows**: Default 64 KB insufficient for high-BDP links. Modern OSes auto-tune.

**2. Packet loss**: Triggers retransmission and congestion control (TCP backs off). Even 0.1% loss seriously hurts.

**3. Latency**: Long RTT = fewer round trips per second = lower throughput.

**4. Slow start**: TCP starts slow, ramps up. Short connections never reach full speed.

**5. Single connection**: Aggregate bandwidth across multiple connections often higher than single connection (e.g., browsers use 6 connections per host).

**6. Application bottleneck**: Disk I/O, CPU, app processing — application slower than network.

**7. Middleware**: Proxies, firewalls add latency/processing.

**Measuring throughput**:
- **iperf3**: Network throughput between two endpoints
- **dd over network**: Crude file transfer test
- **wget/curl**: Real download throughput
- **Speedtest.net**: ISP speed (with caveats — peering, server choice)

**Throughput vs latency vs jitter**:
- **Throughput**: How much you can transfer per second
- **Latency**: Time for one packet
- **Jitter**: Variation in latency

A connection can have:
- High throughput + high latency (satellite, big BDP)
- Low throughput + low latency (1 Mbps DSL with low ping)
- Both high (modern fiber)

**Application-level throughput considerations**:
- HTTP/1.1: Limited by connections per host (~6) — pipeline issues
- HTTP/2: Multiplexes many streams over one connection
- HTTP/3 (QUIC): Even better with no head-of-line blocking
- Compression: Tradeoff CPU for bandwidth

## Real-World Example
**Downloading a 1 GB file across the Pacific** (200 ms RTT):
- ISP claims 1 Gbps bandwidth
- Default TCP: ~64 KB window / 0.2s = ~320 KB/s = 2.5 Mbps
- Even a 1 Gbps pipe gives 2.5 Mbps actual!
- Solutions: TCP window scaling, parallel connections, mirror servers nearby (CDN)

**WAN optimization**: Companies use WAN optimizers (Riverbed, etc.) — TCP termination, dedup, compression — to bridge the throughput gap on long-haul links.

**TCP BBR (Bottleneck Bandwidth and RTT)**: Modern Linux congestion control algorithm that achieves dramatically better throughput than CUBIC over lossy or high-RTT links. YouTube saw measurable improvement after deploying BBR.

## Interview Tips
- Throughput ≠ Bandwidth — they're different concepts
- TCP throughput = window / RTT (memorize this)
- BDP explains big-pipe-long-distance issue
- Mention BBR as modern improvement

## Common Follow-up Questions
1. Why is throughput often less than bandwidth? (Protocol overhead, slow start, packet loss, latency)
2. How to improve throughput on high-RTT link? (Larger TCP window, parallel connections, BBR)
3. What's BDP? (Bandwidth-Delay Product — bytes in flight to fill the pipe)`,

    'MTU and MSS': `## Definition
**MTU (Maximum Transmission Unit)** is the largest packet size (in bytes) that can be transmitted over a network link without fragmentation, typically 1500 bytes for Ethernet. **MSS (Maximum Segment Size)** is the largest TCP segment payload that can fit within the MTU after subtracting headers, typically 1460 bytes for Ethernet (1500 - 20 IP - 20 TCP).

## Why It Matters
MTU/MSS issues cause subtle, hard-to-debug network problems — connections that work for small data but hang on large transfers, mysterious timeouts through VPNs and tunnels. Understanding them is critical for network engineering.

## Detailed Explanation

**MTU**:
- Property of a link layer (Ethernet, Wi-Fi, etc.)
- Ethernet standard: 1500 bytes
- Jumbo frames: 9000 bytes (used in data centers, requires support end-to-end)
- PPPoE: 1492 bytes (PPPoE adds 8 byte header to Ethernet)
- VPN/IPsec tunnels: lower (encapsulation overhead)

**MSS** (TCP-specific):
- The maximum payload bytes per TCP segment
- = MTU - IP header - TCP header
- Standard Ethernet: 1500 - 20 - 20 = 1460
- With options or IPv6: smaller
- Negotiated during TCP handshake (each side advertises)

**Why these matter**:

**1. Fragmentation**:
- If a packet is larger than MTU, IP fragments it (in IPv4) or drops it (in IPv6)
- Fragmentation hurts performance (more processing) and reliability (any fragment lost = retransmit whole)
- Most modern networks try to avoid fragmentation

**2. Path MTU**:
- The smallest MTU along the entire path
- A packet may traverse multiple links; the smallest MTU dictates the maximum
- Example: Ethernet (1500) → PPPoE (1492) → Ethernet (1500) → Path MTU = 1492

**3. PMTUD (Path MTU Discovery)**:
- Sender sets DF (Don't Fragment) bit
- If a router can't forward without fragmenting, it sends ICMP "Fragmentation Needed" with the next-hop MTU
- Sender adjusts segment size and retransmits
- **Problem**: Many firewalls block ICMP — PMTUD silently fails — connections hang

**MTU-related problems**:

**1. PMTUD black hole**: Firewall drops ICMP fragmentation messages. Sender keeps trying max size. Packets dropped. Connection hangs (small packets work, big ones fail).

**2. VPN packet drops**:
- VPN adds encapsulation overhead (e.g., 50 bytes for IPsec)
- If MTU = 1500 and you stuff in 1500 bytes plus VPN headers, exceeds underlying link's 1500 → fragment or drop
- Solution: Reduce MSS via "MSS clamping" on VPN routers

**3. PPPoE on home connections**:
- DSL with PPPoE has MTU 1492
- Misconfigured routers cause PMTUD issues
- Common cause of websites loading partially

**MSS clamping**:
- Router intercepts TCP SYN packets
- Modifies MSS option to be lower than negotiated
- Forces both ends to use smaller segments
- Common on VPN gateways, firewalls

**Jumbo frames**:
- 9000-byte MTU
- Reduces per-packet overhead (fewer headers, less interrupts)
- Common in data centers (storage, big-data)
- Requires end-to-end support — one device with 1500 MTU breaks the chain

**Determining MTU**:
\`\`\`bash
# Linux: check interface MTU
ip link show eth0

# Find Path MTU (manual)
ping -M do -s 1472 example.com  # 1472 + 28 (ICMP+IP headers) = 1500
# If fails: try smaller until success
\`\`\`

**Setting MTU**:
\`\`\`bash
ip link set dev eth0 mtu 1492
\`\`\`

## Real-World Example
**VPN issues**: Users complain "VPN slow, web pages partially load." Cause: VPN encapsulation drops effective MTU below 1500. Without MSS clamping, large TCP segments fragment or drop. Fix: configure MSS clamping on VPN gateway to 1400 or so.

**Data center hyperscale**: Facebook, Google use 9000-byte jumbo frames internally. Reduces CPU overhead per byte transferred — important at petabit scale. Public-facing endpoints still use 1500 (compatibility).

**HTTPS connection through PMTUD black hole**: TLS handshake works (small packets) but actual data doesn't flow. User sees "loading..." forever. Frustrating to debug — need to check ICMP filtering, MSS values.

## Interview Tips
- MTU = link layer; MSS = TCP-layer (after headers)
- Standard Ethernet: MTU 1500, MSS 1460
- PMTUD black holes are a real-world headache
- MSS clamping fixes many VPN issues
- Jumbo frames in data centers

## Common Follow-up Questions
1. Why does fragmentation hurt? (More processing, lost fragment = retransmit whole)
2. What's MSS clamping? (Router intercepts SYN, lowers advertised MSS)
3. Why don't we always use jumbo frames? (Need end-to-end support; mixing breaks)`,
  },
  'System Design': {
    'Load Balancing': `## Definition
**Load balancing** distributes incoming network traffic or compute requests across multiple servers to optimize resource use, maximize throughput, minimize response time, and prevent any single server from being overwhelmed. It's a fundamental scaling technique in distributed systems.

## Why It Matters
Load balancing is the bedrock of horizontally-scaled systems. Every modern web service uses it. Understanding load balancers explains how sites handle millions of users with commodity hardware.

## Detailed Explanation

**Why load balance?**
1. **Scale**: One server can't handle all the traffic
2. **Reliability**: If one server fails, others continue
3. **Maintenance**: Take servers offline for updates without downtime
4. **Geography**: Route users to nearest data center

**Layer 4 vs Layer 7 load balancers**:

**Layer 4 (Transport)**:
- Routes based on IP and port
- Doesn't look at content
- Very fast, low overhead
- Examples: AWS NLB, HAProxy in TCP mode, IPVS

**Layer 7 (Application)**:
- Routes based on HTTP details (URL, headers, cookies)
- Can do path-based routing, header inspection, content-based routing
- Slower than L4 but more flexible
- Examples: AWS ALB, nginx, HAProxy in HTTP mode

**Common algorithms**:

**1. Round Robin**: Send each request to the next server in sequence. Simple, fair if servers are equal.

**2. Weighted Round Robin**: Some servers get more traffic (e.g., bigger machines).

**3. Least Connections**: Send to the server with fewest active connections. Good when request lengths vary.

**4. Least Response Time**: Send to the fastest-responding server.

**5. IP Hash**: Hash client IP → consistent server. Useful for sticky sessions.

**6. Random**: Pick randomly. Surprisingly effective at large scale (good distribution).

**7. Consistent Hashing**: Used in caches/sharding — minimizes redistribution when servers added/removed.

**Health checks**:
- LB periodically checks each server (e.g., HTTP GET /health)
- Failed servers removed from rotation
- Avoids sending traffic to dead servers
- Configurable: interval, timeout, threshold

**Sticky sessions** (session affinity):
- Same user always goes to same server
- Useful when servers maintain state in memory
- Anti-pattern in cloud-native (prefer stateless services)
- Implemented via cookie or IP hash

**SSL/TLS termination**:
- LB decrypts HTTPS, sends plain HTTP to backends
- Centralizes cert management
- Frees backends from crypto overhead
- Re-encrypt to backend if needed (network security)

**Geographic load balancing (GSLB)**:
- DNS-based: return different IPs based on user location
- Anycast: same IP advertised from multiple locations; BGP routes to nearest
- Examples: Cloudflare, AWS Route53, Google Cloud Load Balancer

**Common LB software/services**:

| Tool | Type |
|------|------|
| nginx | L7 software LB, also reverse proxy |
| HAProxy | L4/L7 software LB |
| Envoy | Modern L7, used by Istio service mesh |
| AWS ALB | Managed L7 |
| AWS NLB | Managed L4 |
| AWS CLB | Legacy classic LB |
| Google Cloud LB | Global anycast LB |
| F5 BIG-IP | Hardware LB (enterprise) |

**Architecture patterns**:

**Single-tier**: Internet → LB → servers. Common for simple apps.

**Multi-tier**: 
- Internet → Edge LB (geographic) 
- → Regional LB (within DC) 
- → Service mesh sidecar (per-pod) 
Used by hyperscalers.

**Active-passive vs Active-active**:
- **Active-passive**: One LB serves; backup takes over on failure
- **Active-active**: All LBs serve traffic, distributed via DNS/anycast

## Real-World Example
**Web app on AWS**: Internet → ALB → 4 EC2 instances. ALB does HTTPS termination, health checks every 30s, round-robin requests, removes failed instances. New instances auto-registered as they come up.

**Netflix architecture**: Multiple layers — DNS routes to nearest region (anycast/GSLB), regional load balancers route to availability zones, internal load balancers (Eureka + Ribbon) for service-to-service.

## Interview Tips
- L4 (fast, IP/port) vs L7 (smart, HTTP-aware) is fundamental
- Round Robin and Least Connections are most common algorithms
- Health checks + auto-removal = high availability
- Sticky sessions = anti-pattern in cloud-native
- Anycast for global routing

## Common Follow-up Questions
1. Layer 4 vs Layer 7? (Speed vs intelligence; transport vs application)
2. What's sticky session? (Same user → same server; needed when servers have state)
3. How does LB know a server is healthy? (Periodic health checks)`,

    'Caching Strategies': `## Definition
**Caching** stores frequently-accessed data in fast storage (RAM, edge, etc.) to reduce latency and load on slower backend systems. **Caching strategies** are the patterns governing what to cache, when to cache it, when to invalidate, and how to handle misses. Different strategies suit different access patterns.

## Why It Matters
Cache misses can ruin performance; bad invalidation causes data inconsistency. Choosing the right strategy is one of the most impactful design decisions for system performance and complexity.

## Detailed Explanation

**Cache locations** (where to cache):
- **Client-side**: Browser cache, mobile app cache
- **CDN**: Geographically distributed edge cache
- **Reverse proxy**: nginx, Varnish in front of app
- **Application cache**: Redis, Memcached
- **Database cache**: Query cache, page cache
- **CPU cache**: L1/L2/L3 — automatic, smallest scale

**Caching strategies** (patterns):

**1. Cache-Aside (Lazy Loading)**:
\`\`\`
Read:
  data = cache.get(key)
  if not data:
      data = db.get(key)
      cache.set(key, data)
  return data

Write:
  db.update(key, value)
  cache.invalidate(key)  # or cache.set(key, value)
\`\`\`
Most common pattern. App manages cache directly.
**Pros**: Simple, only caches what's accessed.
**Cons**: First request always slow (cache miss); stale data risk.

**2. Read-Through**:
- Cache transparently fetches from DB on miss
- App reads only from cache
- Cache library handles DB call
- Pros: Cleaner app code
- Cons: Library needs DB integration

**3. Write-Through**:
\`\`\`
Write:
  cache.set(key, value)
  db.update(key, value)  # synchronously
\`\`\`
- Writes go to cache AND DB
- **Pros**: Cache always fresh
- **Cons**: Write latency = cache + DB

**4. Write-Behind (Write-Back)**:
\`\`\`
Write:
  cache.set(key, value)  # only cache
  # later, async flush to DB
\`\`\`
- Writes go to cache; DB updated asynchronously
- **Pros**: Fast writes; can batch
- **Cons**: Risk of data loss on crash

**5. Refresh-Ahead**:
- Predict which keys will be accessed; refresh before expiration
- Avoids cache miss penalty for hot data
- Used for predictable, popular content

**Cache eviction policies** (when full):

| Policy | When evict |
|--------|-----------|
| **LRU** | Least Recently Used |
| **LFU** | Least Frequently Used |
| **FIFO** | First In, First Out |
| **TTL** | Time-based expiration |
| **Random** | Random selection |

**Cache invalidation** (the hard part!):

> "There are only two hard things in Computer Science: cache invalidation and naming things." — Phil Karlton

**Strategies**:
- **TTL (Time-To-Live)**: Set expiry on each entry. Stale data possible until expiry.
- **Write-through invalidation**: On write, immediately invalidate.
- **Event-based**: Publish change events; cache listeners invalidate.
- **Tagged invalidation**: Group related keys; invalidate by tag.

**Cache stampede / thundering herd**:
- Cache entry expires
- Many requests simultaneously miss → all hit DB
- DB overwhelmed
- **Solutions**:
  - Probabilistic early expiration (refresh slightly before)
  - Locking (only one request fetches; others wait)
  - Stale-while-revalidate (serve stale; refresh in background)

**Hit rate / miss rate**:
- Hit rate = % requests served from cache
- Higher = better
- Tune by adjusting size, TTL, eviction
- Goal: 80-95% hit rate typical for popular data

**Cache consistency models**:
- **Strong consistency**: Cache always matches DB (rare; expensive)
- **Eventual consistency**: Cache lags briefly (most common)
- **Read-your-writes**: User sees own writes immediately

**Distributed cache concerns**:
- **Sharding**: Split cache across multiple servers (consistent hashing)
- **Replication**: Multiple copies for HA
- **Cache coherency**: Multiple nodes with their own caches

## Real-World Example
**E-commerce product page**:
- CDN cache: HTML/CSS/JS (TTL 1 hour)
- Application cache (Redis): product details, reviews (TTL 5 min, invalidate on edit)
- Database query cache: aggregations (TTL 1 min)
- Session cache: user data (Redis, in-memory)
- **Result**: 95% of page renders without touching DB

**Twitter timelines**: Pre-computed and cached. Famous architectural decision — instead of computing timeline on read (expensive), they push tweets into recipient's cached timeline on write (read-cheap).

## Interview Tips
- Cache-aside is the most common pattern (memorize)
- Cache invalidation is THE hard problem
- Mention thundering herd and solutions
- TTL vs explicit invalidation tradeoffs
- 80%+ hit rate is the typical target

## Common Follow-up Questions
1. Cache-aside vs read-through? (Who manages cache: app vs library)
2. Write-through vs write-behind? (Sync to DB vs async — durability vs performance)
3. How handle stale cache? (TTL, explicit invalidation, versioning)`,

    'Database Sharding (System Design)': `## Definition
**Sharding** is horizontal partitioning of data across multiple databases or servers, where each shard holds a subset of the data. It enables scaling beyond a single machine's capacity. Each shard typically has its own resources (CPU, memory, disk) and can be replicated for redundancy.

## Why It Matters
When a single database can't handle the load (too much data, too many queries), sharding is the primary scaling solution. Understanding sharding strategies is essential for designing systems that handle billions of records.

## Detailed Explanation

**Why shard?**
- Data exceeds single-server storage
- Read/write throughput exceeds single-server capacity
- Geographic distribution (data closer to users)
- Isolating tenants in multi-tenant systems

**Sharding strategies**:

**1. Hash-based sharding**:
- shard = hash(key) % N
- Even distribution
- **Cons**: Adding/removing shards causes massive resharding (changes the modulo)
- **Solution**: Consistent hashing (only ~1/N data moves when adding a shard)

**2. Range-based sharding**:
- Each shard handles a key range (e.g., A-G, H-N, O-T, U-Z)
- Easy to implement; range queries efficient on a shard
- **Cons**: Hot spots possible (skewed data)
- Used by HBase, MongoDB

**3. Geographic sharding**:
- Shard by user location
- US users in US shard, EU in EU shard
- **Pros**: Low latency, data residency compliance
- **Cons**: Complex for cross-region queries (e.g., user moves)

**4. Directory-based**:
- Lookup service maps key → shard
- Maximum flexibility
- **Cons**: Lookup service is single point of failure

**5. Functional partitioning**:
- Different services use different DBs (e.g., users DB, products DB, orders DB)
- Sometimes called vertical partitioning
- Doesn't address growth WITHIN a service

**Sharding key choice (critical!)**:
- **Even distribution**: Avoid hot spots
- **Query alignment**: Common queries should hit one shard
- **Stable**: Don't change (changing key = data migration)
- **High cardinality**: Many distinct values

**Bad keys**: Country code (skewed — US dominant), creation date (writes hit one shard).

**Good keys**: User ID (high cardinality, even), tenant ID (isolation by tenant).

**Challenges**:

**1. Cross-shard queries**:
- "All users named John" → query every shard, merge results (scatter-gather)
- Slow, doesn't scale
- Avoid in design — ensure common queries are single-shard

**2. Cross-shard transactions**:
- ACID across shards is hard (distributed transactions, 2PC)
- Most NoSQL avoids — provides only single-shard consistency
- Or: design to avoid (event sourcing, sagas)

**3. Joins**:
- Joining across shards is slow/impossible
- Solutions: denormalize, application-side joins, separate analytical DB

**4. Resharding**:
- Adding shards: must move data
- Hash-based requires rehashing — huge migration
- Consistent hashing limits to ~1/N data moved
- Live resharding without downtime is complex

**5. Hot spots**:
- One shard gets disproportionate traffic
- Caused by celebrity users, viral content, time-skewed keys
- Solutions: split hot keys (sub-sharding), replicate hot keys to all shards

**Sharding patterns in practice**:

**MongoDB**: Range-based or hash-based, automatic balancing.

**Cassandra**: Consistent hashing, partition key + clustering key.

**Vitess (YouTube/PlanetScale)**: MySQL sharding layer; manages query routing, resharding.

**DynamoDB**: Hash partitioning by partition key.

**Custom (Twitter, Facebook)**: Often application-level sharding with custom logic.

**Replication + sharding**:
- Each shard is itself replicated for HA
- E.g., 100 shards × 3 replicas = 300 servers
- Reads can be served from replicas; writes go to primary

## Real-World Example
**Twitter sharding**: Tweets sharded by user ID. Your tweets all on one shard. Timeline assembly involves reading from multiple shards (your follows) — solved by pre-computed pushed timelines.

**Slack**: Sharded by workspace. Each workspace's data on its shard. Cross-workspace queries rare (DM is the exception, handled separately).

**Discord (cells architecture)**: Voice/messaging servers sharded by guild ID. Big guilds get dedicated infrastructure.

## Interview Tips
- Hash-based vs range-based — know trade-offs
- Sharding key choice = critical design decision
- Cross-shard queries are the killer downside
- Consistent hashing helps with resharding pain
- Modern systems often use cloud-managed sharding (Vitess, DynamoDB, Spanner)

## Common Follow-up Questions
1. Why is choosing shard key important? (Affects distribution, query patterns, hotspot risk)
2. How handle cross-shard transactions? (Avoid, or use sagas, or distributed transactions if must)
3. What's consistent hashing? (Mapping that minimizes data movement when nodes added/removed)`,

    'Microservices vs Monolith': `## Definition
A **monolith** is a single, unified application where all functionality lives in one codebase, deploys as one unit, and shares one database. **Microservices** decompose an application into many small, independent services that communicate over the network, each with its own codebase, database, and deployment lifecycle.

## Why It Matters
This is one of the most consequential architecture decisions. Microservices done well enable scale and team autonomy; done wrong, they create distributed monoliths with all the complexity and none of the benefits.

## Detailed Explanation

**Monolith characteristics**:
- Single codebase, single deployment
- Shared database (usually)
- In-process function calls between modules
- Single tech stack (typically)
- One CI/CD pipeline

**Microservices characteristics**:
- Many codebases, independently deployed
- Each service owns its data (database-per-service)
- Network calls (REST, gRPC, messaging) between services
- Polyglot (different services can use different languages/DBs)
- Independent CI/CD pipelines
- Service contracts (APIs) define boundaries

**Comparison**:

| Aspect | Monolith | Microservices |
|--------|----------|---------------|
| Codebase | One | Many |
| Deployment | All-or-nothing | Independent |
| Database | Shared | Per service |
| Communication | Function calls | Network (REST/gRPC) |
| Tech stack | Usually unified | Polyglot possible |
| Scalability | Scale whole app | Scale individual services |
| Team structure | Centralized | Per-service teams |
| Startup time | Slower (load all) | Fast (small services) |
| Complexity | Low | High (distributed system!) |
| Performance | Faster (no network) | Slower (network hops) |
| Debugging | Easier (one process) | Harder (distributed traces) |
| Initial speed | Fast | Slow (infra setup) |

**When to use monolith**:
- Small teams (1-20 engineers)
- Early-stage products (don't know domain boundaries yet)
- Simple domain
- Performance critical (intra-process calls fastest)
- "Modular monolith" is often the right answer — well-organized but single deployment

**When to use microservices**:
- Large engineering organization (hundreds of engineers)
- Different scaling needs per component
- Different teams need independent release cycles
- Different tech stacks needed
- Mature understanding of domain boundaries

**Antipatterns**:

**1. "Distributed monolith"**: Microservices that must all deploy together — got the cost without the benefits.

**2. "Microservices fever"**: Splitting too early when you don't understand boundaries → constant refactoring across service boundaries (network) instead of within (compilation).

**3. "Shared database microservices"**: Multiple services on same DB — coupling defeats independence.

**4. "Nano-services"**: Splitting too small. Service-per-function isn't scalable.

**Microservices challenges**:

**1. Distributed system complexity**: Network failures, partial failures, eventual consistency, distributed tracing.

**2. Operational overhead**: Many services to monitor, deploy, debug.

**3. Data consistency**: No cross-service ACID. Sagas, eventual consistency.

**4. Latency**: Network hops add up.

**5. Versioning**: Service A v3 must coexist with v2 during rollouts.

**6. Service discovery**: How do services find each other?

**7. Authentication**: Who can call what?

**Patterns to support microservices**:
- **API Gateway**: Single entry point for clients
- **Service mesh**: Sidecar proxy (Envoy) handles service-to-service concerns
- **Event-driven architecture**: Loose coupling via events
- **Circuit breakers**: Prevent cascading failures
- **Distributed tracing**: Track requests across services (Jaeger, Zipkin)

**Modular monolith** (middle ground):
- Single deployment, but well-organized internal modules
- Clear module boundaries
- Often the right starting point — can extract microservices later if needed
- Examples: Shopify (famous monolith), early Amazon

**The Amazon evolution**:
- Started monolithic in 1990s
- Moved to SOA in early 2000s ("two-pizza teams")
- Now thousands of microservices
- Their journey is the canonical example

**Conway's Law**:
- "Organizations design systems that mirror their communication structures"
- Service boundaries should match team boundaries
- Microservices for org-of-orgs, monolith for small teams

## Real-World Example
**Netflix**: Started as monolithic DVD-rental site. Migrated to ~700 microservices on AWS for streaming. Each team owns ~5-15 services. Massive investment in tooling (Hystrix, Zuul, Eureka, Spinnaker).

**Shopify**: Famously runs a Rails monolith handling huge traffic. Modular monolith approach. Has carved out specific services but core remains monolithic.

**Stack Overflow**: Monolithic .NET app handles ~1.3 billion page views/month on a small fleet. Proves monoliths can scale enormously.

## Interview Tips
- Don't reflexively recommend microservices — it's a complex trade-off
- "Start with monolith, extract services later" is wise advice
- Conway's Law connects org structure to architecture
- Mention modular monolith as middle ground
- Distributed monolith is the worst of both worlds

## Common Follow-up Questions
1. When would you NOT use microservices? (Small team, early product, simple domain)
2. What's a distributed monolith? (Microservices that can't deploy independently)
3. How break up a monolith? (Identify bounded contexts, extract one service at a time, strangler pattern)`,

    'Event-Driven Architecture': `## Definition
**Event-driven architecture (EDA)** is a software pattern where components communicate by producing and consuming events asynchronously rather than calling each other directly. Components are decoupled — producers don't know who consumes their events; consumers don't know who produced them. Events are typically routed through message brokers or event streams.

## Why It Matters
EDA enables loose coupling, scalability, and resilience. It's foundational for modern distributed systems, especially microservices, real-time data processing, and reactive applications.

## Detailed Explanation

**Core concepts**:

**Event**: A record of something that happened. Immutable. Past tense ("OrderPlaced", "UserSignedUp").

**Producer (publisher)**: Emits events. Doesn't care who consumes them.

**Consumer (subscriber)**: Receives and reacts to events. May trigger more events.

**Event broker / bus**: Middleware that routes events. Examples: Kafka, RabbitMQ, AWS SNS/SQS, Google Pub/Sub.

**Architectural styles**:

**1. Pub/Sub (Publish-Subscribe)**:
- Producer publishes to a topic
- Multiple consumers subscribed
- Each receives a copy
- Broadcasting / fan-out

**2. Event streaming**:
- Events stored in ordered log (durable)
- Consumers read at their own pace
- Can replay
- Examples: Apache Kafka, AWS Kinesis

**3. Message queues**:
- Producer puts message on queue
- ONE consumer takes each message
- Work distribution / load balancing
- Examples: RabbitMQ queues, AWS SQS

**4. Event sourcing**:
- Application state derived from sequence of events
- Events are the source of truth
- Can rebuild state by replaying events
- Combined with CQRS for read/write separation

**Benefits**:

**1. Loose coupling**: Producer doesn't know consumers; consumers don't know producer. Add new consumers without changing producer.

**2. Scalability**: Producers and consumers scale independently. Brokers absorb load spikes.

**3. Resilience**: If consumer is down, events queue up; processed when back. No cascade failures.

**4. Asynchrony**: Long-running tasks don't block requests. User gets immediate response; work happens in background.

**5. Audit trail**: Events naturally form a log of what happened.

**6. Real-time analytics**: Stream processing on events (Kafka Streams, Flink).

**Trade-offs**:

**1. Complexity**: Distributed systems are hard. Debugging is harder.

**2. Eventual consistency**: Events propagate asynchronously — different services see different states briefly.

**3. Ordering**: Events may arrive out of order. Need careful handling.

**4. Idempotency**: Events may be delivered more than once (at-least-once). Handlers must be idempotent.

**5. Schema evolution**: Event schema changes affect all consumers.

**6. Observability**: Tracing a request across many async hops requires tooling.

**Common patterns**:

**Saga pattern**: Long-running transaction split into local transactions, coordinated via events. Compensating transactions on failure.

**CQRS (Command Query Responsibility Segregation)**:
- Write side: handle commands, emit events
- Read side: project events into query-optimized stores
- Allows independent scaling of reads/writes

**Event sourcing**: Store all events. Current state = fold(events). Powerful for audit, time travel, derivation.

**Outbox pattern**: To atomically save state AND emit event:
1. Write event to outbox table in same DB transaction
2. Separate process reads outbox, publishes events
3. Avoids inconsistency between DB and event stream

**Common technologies**:

| Tool | Type | Use case |
|------|------|---------|
| Apache Kafka | Event stream | High-throughput, durable logs |
| RabbitMQ | Message queue | Traditional pub/sub, queue |
| AWS SQS | Queue | Simple queue, managed |
| AWS SNS | Pub/sub topic | Fan-out |
| AWS Kinesis | Stream | Kafka-like, managed |
| NATS | Messaging | Lightweight, fast |
| Redis Streams | Stream | Embedded in Redis |

**At-most-once / at-least-once / exactly-once**:
- **At-most-once**: Event may be lost (fast, simple)
- **At-least-once**: Event may be delivered multiple times (most common — requires idempotent consumers)
- **Exactly-once**: Hard; usually approximated via idempotency + dedup

## Real-World Example
**E-commerce order flow** (event-driven):
1. User clicks "Place Order" → OrderService creates order, emits OrderPlaced event
2. PaymentService consumes OrderPlaced → charges card → emits PaymentSucceeded
3. InventoryService consumes PaymentSucceeded → reserves items → emits ItemsReserved
4. ShippingService consumes ItemsReserved → ships → emits OrderShipped
5. EmailService consumes OrderShipped → sends notification
6. AnalyticsService consumes ALL events for reporting

If shipping is down, events pile up but other things keep working. Add new analytics consumer without touching others.

**Uber's match dispatch**: Real-time location streams + ride request events processed via Kafka. Drivers and riders matched by stream-processing.

## Interview Tips
- Decoupling is the key benefit
- Mention Kafka or similar broker as standard
- Eventual consistency is the cost
- Idempotency is critical (at-least-once delivery)
- CQRS, saga, event sourcing — advanced patterns

## Common Follow-up Questions
1. Pub/sub vs message queue? (Pub/sub: many consumers, each gets copy. Queue: many consumers, one gets each)
2. Why must consumers be idempotent? (At-least-once delivery — same event may arrive twice)
3. Event sourcing vs CRUD? (Source of truth: events vs current state)`,

    'Message Queues': `## Definition
A **message queue** is a middleware component that enables asynchronous communication between services by buffering messages between producers and consumers. Producers send messages to the queue; consumers retrieve and process them. Queues decouple sender and receiver in time and load.

## Why It Matters
Message queues power background job processing, async workflows, load leveling, and microservice communication. They're a core building block of modern distributed systems.

## Detailed Explanation

**Basic flow**:
1. Producer sends message to queue
2. Queue buffers message (durably or in-memory)
3. Consumer pulls (or is pushed) message
4. Consumer processes
5. Acknowledges → message removed from queue

**Why use queues**:

**1. Decoupling**: Producer doesn't wait for consumer. Producer doesn't know who consumes.

**2. Load leveling**: Bursty traffic → smooth processing. Queue absorbs spikes.

**3. Async processing**: User-facing request returns immediately; work happens in background.

**4. Resilience**: Consumer down? Messages queue up; processed when back.

**5. Scaling**: Add more consumers to drain queue faster.

**6. Retries**: Failed processing → redelivery.

**Common queueing patterns**:

**Work queue (1-to-1)**: Each message goes to exactly one consumer. Distributed work.

**Pub/sub (1-to-many)**: Each message goes to all subscribers. Fan-out.

**Priority queue**: Higher-priority messages processed first.

**Delay queue**: Messages delivered after a delay (e.g., scheduled jobs).

**Dead-letter queue (DLQ)**: Messages that fail repeatedly moved here for manual inspection.

**Reliability semantics**:

**At-most-once**:
- Possible message loss
- No retries
- Faster, simpler

**At-least-once** (most common):
- Possible duplicates
- Consumer must be idempotent
- Acknowledgement required after processing

**Exactly-once**:
- Hard; usually approximated
- Requires transactional message handling
- Examples: Kafka with transactions, application-level idempotency

**Common message queue systems**:

**RabbitMQ**:
- AMQP protocol
- Mature, feature-rich (exchanges, routing)
- Good for complex routing
- ~10K msg/sec per node

**Apache Kafka**:
- Actually a streaming log, but used as queue
- Very high throughput (millions msg/sec)
- Durable, replayable
- Good for event sourcing, analytics

**AWS SQS**:
- Managed, serverless
- Simple, scales effortlessly
- Standard (at-least-once) and FIFO (exactly-once)
- Good for cloud-native

**Redis (lists, streams)**:
- Simple, in-memory
- Fast but less durable (unless configured)
- Good for lightweight queueing

**ActiveMQ, ZeroMQ, NATS**: Other options with different trade-offs.

**Comparison**:

| System | Throughput | Durability | Use case |
|--------|------------|------------|---------|
| RabbitMQ | Medium | Yes | Complex routing |
| Kafka | Very high | Yes | Event streaming |
| SQS | High | Yes | Cloud, simple |
| Redis | Very high | Configurable | Lightweight |

**Visibility timeout / processing window**:
- After a consumer takes a message, it's invisible to others for N seconds
- If consumer succeeds + acknowledges within window → message removed
- If consumer fails or times out → message reappears for another consumer
- Tune based on expected processing time

**Backpressure**:
- Queue full? Producer slowed down or blocked
- Important to prevent memory exhaustion
- Different systems handle differently (Kafka: durable, no backpressure; in-memory queues: blocking)

**Ordering**:
- FIFO queues (SQS FIFO, Kafka per partition): preserve order
- Standard queues: best-effort ordering (may reorder)
- Most systems sacrifice some ordering for higher throughput

**Common pitfalls**:

**1. Non-idempotent consumers**: Duplicate processing causes bugs.

**2. Slow consumers**: Queue fills up, latency grows.

**3. Hot keys**: Same partition key = all messages on one partition (Kafka).

**4. Message size**: Large messages hurt throughput. Better: store in S3, queue the reference.

**5. Poison messages**: Bad message keeps failing → blocks queue. Solution: DLQ after N retries.

## Real-World Example
**Image upload processing**:
1. User uploads image; web server saves to S3, puts message in queue, returns immediately
2. Worker takes message, generates thumbnails (slow)
3. Worker takes another message — parallel processing
4. User can continue browsing while processing happens

Without queue: web server holds connection during long processing → poor UX.

**Spike handling**: Black Friday traffic 10× normal. Queue absorbs spike; workers (auto-scaled) drain over time. Without queue, spike crashes the service.

## Interview Tips
- Async = key benefit
- At-least-once is most common (mention idempotency)
- DLQ is important for production reliability
- Kafka vs RabbitMQ vs SQS — know basic differences
- Visibility timeout / processing window = critical concept

## Common Follow-up Questions
1. At-least-once vs exactly-once? (Duplicates possible vs guaranteed unique — exactly-once is hard)
2. What's a DLQ? (Dead-letter queue — failed messages parked for inspection)
3. Why might message ordering not be guaranteed? (Multiple partitions/consumers; system chose throughput over order)`,
    'CAP Theorem (System Design)': `## Definition
The **CAP Theorem** states that in any distributed data system, you can guarantee at most TWO of these three properties simultaneously: **Consistency** (every read sees the latest write), **Availability** (every request gets a response), and **Partition Tolerance** (system works despite network failures). Since network partitions are inevitable, real distributed systems must choose between consistency and availability when partitions occur.

## Why It Matters
CAP is foundational for understanding distributed databases. It clarifies fundamental trade-offs you face when designing systems and explains why different databases make different choices (DynamoDB vs MongoDB vs Spanner).

## Detailed Explanation

**The three properties**:

**Consistency (C)**: All nodes see the same data at the same time. After a write, every read returns the latest value.

**Availability (A)**: Every request to a non-failing node receives a response (success or failure, but not a hang).

**Partition Tolerance (P)**: System continues operating despite arbitrary message loss between nodes.

**The fundamental trade-off**:
- Network partitions WILL happen in real systems
- During a partition, must choose:
  - **Stay available** → may serve stale data (sacrifice C)
  - **Stay consistent** → reject requests (sacrifice A)

**CAP categorizations**:

**CP systems** (Consistency + Partition Tolerance):
- Prefer correctness over availability
- During partition: refuse writes/reads on minority side
- Examples: HBase, MongoDB (default), etcd, ZooKeeper, Spanner

**AP systems** (Availability + Partition Tolerance):
- Prefer responding over correctness
- During partition: continue serving, reconcile later
- Examples: Cassandra, DynamoDB, CouchDB, Riak

**CA systems** (theoretical only — no partitions):
- Single-node or never-partitioned systems
- Pure CA doesn't exist in distributed systems
- Traditional RDBMS (single-node) — but loses A or C if you scale

**Common misconceptions**:

**"Pick 2 of 3"** is the simplified version. More accurate:

**PACELC theorem** extension:
- During Partition: choose Availability or Consistency
- Else (no partition): choose Latency or Consistency
- E.g., DynamoDB is PA/EL — available during partitions, prioritizes latency normally

**CAP applies to writes that span partitions**:
- For data on a single partition, no trade-off
- Trade-off only when crossing partitions

**Real-world systems**:

| System | CAP Choice | Notes |
|--------|------------|-------|
| MongoDB | CP (configurable) | Primary writes; tunable read concerns |
| Cassandra | AP (tunable) | Tunable consistency per query |
| DynamoDB | AP (default) | Strong consistency available per read |
| etcd, ZooKeeper | CP | Coordination needs strong consistency |
| Spanner | CP | But ~5 nines availability via TrueTime + Paxos |
| Cosmos DB | Tunable | Five consistency levels |

**Why partition tolerance is non-negotiable**:
- Networks fail. Switches, fibers, routers — all can fail
- A single-DC system might experience 99.99% network reliability
- A multi-DC system WILL see partitions
- "CA" without P means accepting that ONE network glitch breaks everything

**Tunable consistency**:
- Modern databases let you choose per query
- Cassandra: ONE, QUORUM, ALL consistency levels
- DynamoDB: Strong vs eventually consistent reads
- Lets app pick the right trade-off per use case

**Strong consistency techniques**:
- **Quorum**: Read from majority, write to majority
- **Consensus** (Raft, Paxos): All nodes agree on order of operations
- **Serializable transactions**: Isolation + atomicity guarantees

**Eventual consistency**:
- All replicas eventually converge
- Reads may return stale data temporarily
- "Read your writes" guarantee important for UX

## Real-World Example
**Banking** (chooses CP): If network partitions, would rather be unavailable than risk inconsistency (double-spending). Uses systems like Spanner or traditional RDBMS with strong consistency.

**Twitter/Facebook timeline** (chooses AP): If a partition happens, prefer to show slightly stale data than no data. Tweet from 30 seconds ago not appearing yet is OK.

**Shopping cart**: AP works — eventual consistency fine. Cart contents may merge oddly during failure (Amazon's classic example), but better than rejecting cart adds.

**Distributed lock service** (etcd, ZooKeeper, CP): Cannot give a lock to two different clients. Must be strongly consistent — accept unavailability over conflicts.

## Interview Tips
- Always specify "CAP applies during partition"
- "Pick 2" is simplified — really, P is given, choose between C and A
- Mention PACELC for extra credit
- Real systems often configurable (Cassandra)
- Banking = CP, social media = AP — common framing

## Common Follow-up Questions
1. Is CAP always "pick 2"? (Approximation; really, choose C or A during partition)
2. What's PACELC? (Extends CAP — also choose C or L when no partition)
3. Can you have eventual consistency AND strong? (Tunable per query — many modern DBs offer this)`,

    'Consistency Models': `## Definition
**Consistency models** define what guarantees a distributed system makes about the visibility and ordering of operations. They span a spectrum from **strict serializability** (operations appear instantaneous in a single global order) to **eventual consistency** (reads may see stale data; replicas converge eventually). Choice affects performance, availability, and developer mental model.

## Why It Matters
Consistency models are the contract a database promises to your application. Misunderstanding them causes subtle bugs (lost updates, time-travel reads). Knowing the spectrum lets you pick the right trade-off.

## Detailed Explanation

**Spectrum of consistency** (strongest to weakest):

**1. Strict serializability** (linearizability + serializability):
- All operations appear in a single global order matching real-time
- Strongest possible guarantee
- Hard to achieve at scale

**2. Linearizability**:
- Operations appear atomic and in real-time order
- "If A finishes before B starts, A is ordered before B"
- Each operation appears to take effect at a single point in time
- Examples: etcd, ZooKeeper, single-master databases

**3. Sequential consistency**:
- All operations appear in some sequential order
- Each process's operations preserved in their order
- But no real-time ordering between processes
- Weaker than linearizability (no real-time guarantee)

**4. Causal consistency**:
- Causally related operations seen in order by all
- Concurrent (non-causal) operations may be seen in different orders
- "If A causes B, everyone sees A before B"
- Examples: Bayou, COPS

**5. Read-your-writes**:
- After you write, you immediately see your write
- Other users may not see it yet
- Common UX requirement

**6. Monotonic reads**:
- Once you've seen a value, you won't see an older one
- Prevents "going back in time"

**7. Eventual consistency**:
- Eventually, all replicas converge to the same state
- No timing guarantees
- Reads may see stale data
- Examples: DNS, S3 (until 2020), early Cassandra

**Strict consistency vs eventual consistency**:

| Aspect | Strict | Eventual |
|--------|--------|----------|
| Read sees | Latest write | May be stale |
| Replicas | Locked together | Loosely synchronized |
| Performance | Lower (coordination) | Higher (no waiting) |
| Availability | Lower | Higher |
| Examples | RDBMS, Spanner | DNS, eventual NoSQL |
| Application complexity | Simple model | Must handle stale data |

**Achieving consistency**:

**Strong (linearizability)**:
- Single master (all writes serialized)
- Distributed consensus (Paxos, Raft)
- Quorum (majority must agree)

**Eventual**:
- Async replication
- Conflict-free replicated data types (CRDTs)
- Last-write-wins (LWW)
- Vector clocks for ordering

**Conflict resolution** (eventual systems):
- **LWW (Last Write Wins)**: Latest timestamp wins. Simple, may lose updates.
- **Multi-value (MV)**: Keep concurrent versions; app reconciles
- **CRDTs**: Math types that automatically merge (counters, sets)
- **Custom merge**: App-specific logic

**Real-world consistency choices**:

**Strong consistency required**:
- Banking transactions
- Inventory tracking
- Distributed locks
- Authentication tokens

**Eventual consistency OK**:
- Social media posts
- Analytics dashboards
- Product reviews
- Like counts (off-by-one acceptable)

**Tunable per query (Cassandra example)**:
- ONE: Faster, weaker consistency
- QUORUM: Balanced
- ALL: Slower, strongest

**ACID vs BASE**:
- **ACID**: Strong consistency (traditional RDBMS)
- **BASE** (Basically Available, Soft state, Eventual consistency): Trade strict consistency for availability/scalability

## Real-World Example
**Bank transfer**: Strong consistency required. If A transfers \$100 to B, must atomically debit A and credit B. No state where money is gone from A but not in B.

**S3 (until 2020 — eventual consistency for overwrites)**: Used to have eventual consistency on overwrites. After uploading, GET could return old version briefly. Caused bugs. Now strongly consistent.

**Cassandra in IoT**: Sensor writes 1000s/sec. Reads can tolerate stale by 1 second. Use ONE consistency for max throughput.

**ZooKeeper for distributed locks**: Strong consistency mandatory. Otherwise two clients could think they have the lock simultaneously.

## Interview Tips
- Linearizability is the strongest practical guarantee
- Eventual consistency has named subcategories (read-your-writes, monotonic, etc.)
- "Read-your-writes" is critical for user-facing apps
- Tunable consistency = modern flexibility
- ACID/BASE framing for technical/non-technical audiences

## Common Follow-up Questions
1. Linearizable vs serializable? (Linearizable: real-time order. Serializable: some sequential order, may not match real-time)
2. What's eventual consistency? (Replicas converge eventually; no timing guarantee)
3. What's read-your-writes? (After writing, you see your write — important UX guarantee)`,

    'Distributed Locking': `## Definition
A **distributed lock** is a mechanism to ensure that only ONE process across multiple machines can execute a critical section at a time. It generalizes the local mutex to a network setting, requiring coordination among machines that may fail or be partitioned.

## Why It Matters
Distributed locks coordinate access to shared resources in distributed systems — preventing duplicate jobs, race conditions on shared state, and conflicting updates. Done wrong, they cause subtle bugs that are nearly impossible to reproduce.

## Detailed Explanation

**The problem**:
- Many machines might try to update the same resource
- Network calls are slow and fail
- Some machine might crash while holding the lock
- Need coordination — but how?

**Common implementations**:

**1. Database-based**:
\`\`\`sql
INSERT INTO locks (name, owner, expires) VALUES ('job-123', 'worker-A', NOW()+INTERVAL 60 SECOND);
-- If insert succeeds, you have the lock
-- Periodically extend expiration
-- Delete on completion
\`\`\`
**Pros**: Simple, leverages DB transactions
**Cons**: Lock service is your DB (load); can be slow

**2. Redis (single-node SETNX)**:
\`\`\`
SET lock-key worker-A NX EX 60
-- NX: only set if not exists
-- EX 60: expire in 60s
\`\`\`
- Single Redis: simple, fast
- Multi-Redis: complex (Redlock — controversial!)

**3. ZooKeeper (ephemeral nodes)**:
- Create ephemeral sequential znode
- If yours has lowest sequence number, you have the lock
- If you crash, znode auto-deletes (lock released)
- Strong consistency, well-tested for locking

**4. etcd / Consul**:
- Similar to ZooKeeper
- Lease-based locks
- Used by Kubernetes for leader election

**Critical issues**:

**1. Deadlocks**:
- Process holds lock, crashes, never releases
- **Solution**: Always use timeout/expiration

**2. Premature expiration**:
- Process working slowly; lock expires
- Another process gets the lock
- Original process completes thinking it still has lock → conflict
- **Solution**: Heartbeat/extension; or use fencing tokens

**3. Fencing tokens**:
- Each lock acquisition gets a monotonically increasing token
- Resource (e.g., DB) checks token on each operation
- Old token? Reject — that holder lost its lock
- Critical for correctness when expiration could cause overlap

**4. Network partitions**:
- Lock service partitioned: how to decide who has the lock?
- CP systems (ZK, etcd): refuse to grant during partition
- AP systems (Redis Redlock): may grant to multiple

**The Redlock controversy**:
- Redlock is a proposed multi-Redis distributed lock algorithm
- Martin Kleppmann argued it's broken (not safe under timing assumptions)
- Antirez (Redis creator) defended it
- Current consensus: ZooKeeper/etcd are safer for correctness-critical locks

**Patterns to AVOID locks when possible**:

**1. Idempotent operations**: If your operation can be retried safely, you don't need exclusivity.

**2. Optimistic concurrency**: Use version numbers; reject if changed since read.

**3. Compare-and-swap (CAS)**: Atomic update only if previous value matches.

**4. Sharding**: Partition data so each piece has only one writer (no contention).

**5. Event sourcing**: Append-only log, no in-place updates.

**Practical recipe**:
\`\`\`
1. Acquire lock with timeout T
2. Start work; periodically extend lock (heartbeat)
3. If extending fails (lost lock), abort work
4. Use fencing token in resource updates
5. Release lock on completion
\`\`\`

## Real-World Example
**Cron job in Kubernetes** (don't run twice):
- Multiple replicas could each try to run scheduled job
- Use lease (Kubernetes built-in via etcd):
  - Each replica tries to acquire lease "cron-foo"
  - Only the holder runs the job
  - On crash, lease expires; next replica takes over

**Database migration deployment**: Don't run migrations from multiple instances. Acquire distributed lock; only one runs migrations.

**Leader election**: Common use case. Among N replicas, exactly one is "leader". Achieved via distributed lock; loser retries when leader's lease expires.

## Interview Tips
- "Distributed locks are hard" — acknowledge complexity
- ZooKeeper/etcd are safe; Redis Redlock is controversial
- Fencing tokens are the gold standard for safety
- Always have timeout; never trust forever-locks
- Prefer designs that don't need distributed locks (idempotency, CAS)

## Common Follow-up Questions
1. What's a fencing token? (Monotonic ID checked by resource — prevents late-arriving holders)
2. Why is Redlock controversial? (Timing assumptions break under clock skew, GC pauses)
3. How avoid distributed locks? (Idempotency, CAS, sharding, event sourcing)`,

    'Consistent Hashing': `## Definition
**Consistent hashing** is a hashing technique where adding or removing a node only requires remapping ~K/N keys (where K = total keys, N = nodes), instead of nearly all keys. Nodes and keys both hash to a circular space; each key is owned by the next node clockwise. It's foundational for distributed caches, sharded databases, and load balancers.

## Why It Matters
Naive hashing (\`hash(key) % N\`) requires moving almost all data when N changes — disastrous for live systems. Consistent hashing solves this. Used in Cassandra, DynamoDB, Memcached, and many CDNs.

## Detailed Explanation

**The naive approach problem**:
\`\`\`
shard = hash(key) % N
\`\`\`
If N changes from 4 to 5, almost every key gets a new shard. Migration nightmare.

**Consistent hashing**:
1. Imagine a circle (hash ring) with values 0 to 2^32 - 1
2. Hash each NODE: place at \`hash(node_id)\` on the ring
3. Hash each KEY: place at \`hash(key)\` on the ring
4. To find which node owns a key: walk clockwise from key's position; first node encountered owns it
5. When a node is added/removed, only keys between it and its predecessor migrate

**Adding a node**:
- New node hashes to position X
- Takes ownership of keys between X and its clockwise neighbor
- Only those keys move
- Other nodes unaffected

**Removing a node**:
- Its keys go to the next clockwise node
- Other nodes unaffected

**Mathematically**:
- N nodes, K keys
- Adding/removing 1 node: ~K/N keys move
- Vastly better than \`% N\` (which moves ~K(N-1)/N keys)

**Virtual nodes (vnodes)**:
- Each physical node represented by MANY positions on the ring (e.g., 100-1000)
- Better load distribution
- Heterogeneous nodes: powerful nodes get more vnodes
- Used by Cassandra, DynamoDB, Riak

**Why vnodes**:
- Without: nodes near each other on ring share imbalanced load
- With: average effect smooths distribution
- Also helps with heterogeneous machines (vary vnode count by capacity)

**Implementation**:
\`\`\`python
import hashlib

class ConsistentHash:
    def __init__(self, nodes, replicas=100):
        self.replicas = replicas
        self.ring = {}  # hash → node
        self.sorted_keys = []
        for node in nodes:
            self.add(node)
    
    def add(self, node):
        for i in range(self.replicas):
            key = self.hash(f"{node}:{i}")
            self.ring[key] = node
            bisect.insort(self.sorted_keys, key)
    
    def get(self, key):
        if not self.ring:
            return None
        h = self.hash(key)
        idx = bisect.bisect(self.sorted_keys, h) % len(self.sorted_keys)
        return self.ring[self.sorted_keys[idx]]
    
    def hash(self, key):
        return int(hashlib.md5(key.encode()).hexdigest(), 16)
\`\`\`

**Use cases**:

**1. Distributed caches** (Memcached client side):
- Client hashes keys to specific cache servers
- Adding a server invalidates only its keys, not all

**2. Distributed databases** (Cassandra, DynamoDB):
- Partition data across nodes
- Replicate to next N nodes clockwise

**3. CDNs**:
- Map content to specific edge servers
- Adding edges requires minimal rebalancing

**4. Load balancing**:
- Sticky routing — same client always to same backend
- Backend join/leave doesn't disturb others

**Comparison with alternatives**:

| Technique | Movement on add/remove |
|-----------|-------------------------|
| Modulo | ~all keys |
| Consistent hashing | ~K/N keys |
| Rendezvous (HRW) | ~K/N keys (no ring) |
| Jump consistent hash | ~K/N keys (very compact) |

**Rendezvous hashing** (alternative):
- For each key, compute hash with each node; pick highest
- No ring; just \`max(hash(key, node_i) for all i)\`
- Same migration cost as consistent hashing
- Simpler in some ways

**Jump consistent hash** (Google):
- O(log N) lookup, no memory of ring
- Very efficient
- Used in Spanner, Vitess

## Real-World Example
**Memcached client**: Application uses consistent hashing client library. Cache servers added or removed; only affected keys evicted. Vast improvement over modulo hashing.

**Cassandra**: Partitions data using consistent hashing with vnodes. Replication to next 3 nodes. Adding a node: it claims ~1/N of vnode positions; only those keys migrate.

**Discord channel sharding**: Channels mapped to specific Erlang processes via consistent hashing. Servers can be added without major reshuffling.

## Interview Tips
- Solve the naive % N problem — that's the motivation
- Vnodes are the practical extension
- ~K/N keys move on add/remove — memorize this
- Used in Cassandra, DynamoDB, Memcached, CDNs — classic answer

## Common Follow-up Questions
1. Why vnodes? (Smoother distribution; supports heterogeneous nodes)
2. Why not just modulo? (Adding/removing nodes redistributes everything)
3. How handle replication? (Walk N nodes clockwise from key)`,

    'Bloom Filters': `## Definition
A **Bloom filter** is a probabilistic data structure that tests whether an element is a member of a set. It can return false positives ("might be in the set") but never false negatives ("definitely not in the set"). It uses far less memory than storing the full set, with predictable error rate.

## Why It Matters
Bloom filters solve the "is it possibly in this set?" question with tiny memory. Used in databases (LSM trees), CDNs, web crawlers, and password breach checking. They're the first line of defense before expensive lookups.

## Detailed Explanation

**Structure**:
- Bit array of size m (initially all 0s)
- k different hash functions
- Each hash function maps an element to one of m positions

**Operations**:

**Insert(x)**:
- For each hash function h_i, set bit h_i(x) % m to 1

**Query(x)** ("might it be in the set?"):
- Check each h_i(x) % m
- ALL bits 1: "Maybe in set" (could be true, could be false positive)
- ANY bit 0: "Definitely NOT in set" (no false negatives)

**Example**:
\`\`\`
Bit array (m=10): 0000000000

Insert "apple":
  h1("apple") % 10 = 3 → set bit 3
  h2("apple") % 10 = 7 → set bit 7
  Array: 0001000100

Insert "banana":
  h1("banana") % 10 = 1 → set bit 1
  h2("banana") % 10 = 7 → already 1
  Array: 0101000100

Query "apple":
  bits 3 and 7: both 1 → "maybe"

Query "cherry":
  h1("cherry") % 10 = 2 → bit 2 is 0 → "definitely not"

Query "grape" (not inserted):
  h1("grape") % 10 = 1 → 1 (set by banana)
  h2("grape") % 10 = 3 → 1 (set by apple)
  → "maybe" — but actually FALSE POSITIVE!
\`\`\`

**False positive rate**:
- Approximately: \`(1 - e^(-kn/m))^k\`
- Where: m = bits, n = items, k = hash functions
- Optimal k ≈ (m/n) × ln(2)
- For ~1% false positive rate, need ~9.6 bits per element

**Sizing**:
- Want 1% false positive rate, 1 million items?
- m ≈ 9.6 million bits ≈ 1.2 MB
- vs storing 1 million strings: tens to hundreds of MB
- Massive memory savings

**Properties**:

**Pros**:
- Very memory-efficient
- O(k) insert and query (constant for fixed k)
- No false negatives

**Cons**:
- False positives possible
- Cannot delete (without tricks)
- Cannot iterate over members
- Cannot count

**Variants**:

**Counting Bloom filter**:
- Each "bit" is a small counter (e.g., 4 bits)
- Insert increments; delete decrements
- Allows deletion; uses more memory

**Cuckoo filter**:
- Allows deletion
- Better space efficiency for low false positive rates
- More complex

**Scalable Bloom filter**:
- Series of filters; new filter when old fills up
- Allows growth without resizing

**Use cases**:

**1. Database storage (LSM trees)**:
- Each SSTable has a bloom filter for its keys
- Before reading the SSTable, check filter
- If "definitely not" → skip the disk read entirely
- Massive read speedup for non-existent keys
- Used by Cassandra, RocksDB, LevelDB, BigTable

**2. CDN cache**:
- Bloom filter of content present in cache
- Avoid origin lookup for content known to be missing

**3. Web crawler URL deduplication**:
- Track visited URLs without storing them all
- Some duplicates re-crawled (false positives) but never miss new

**4. Password breach checking** (HIBP):
- Have I Been Pwned uses bloom-filter-like structure
- Checks if password hash is in breach DB
- No need to store actual hashes

**5. Spam filtering**:
- Set of known spam senders
- Quick check before expensive analysis

**6. Bitcoin SPV clients**:
- Lightweight wallet sends bloom filter of its addresses to full node
- Node sends transactions matching filter (with false positives — privacy!)

## Real-World Example
**Cassandra reads**:
1. Query for key X
2. Check memtable: not there
3. For each SSTable, check bloom filter
4. If filter says "no", skip SSTable (don't read disk)
5. If filter says "maybe", check the actual SSTable
6. Return result

Without bloom filter: read every SSTable (slow).
With bloom filter: read only relevant SSTables.

**Chrome's safe browsing**: Bloom filter of malicious URLs sent to client. Before visiting, check filter. If "maybe", do server lookup. If "no", skip lookup. Saves billions of unnecessary requests.

## Interview Tips
- "Probabilistic, no false negatives" — key headline
- Memory savings vs hash set is huge
- LSM trees + bloom filters = database design classic
- Mention false positive rate / can be tuned
- Cannot delete (in basic version)

## Common Follow-up Questions
1. Why no false negatives? (If you inserted X, all bits set; query checks same bits → must all be 1)
2. How tune false positive rate? (More bits + more hash functions = lower rate)
3. Why can't basic bloom filter delete? (Other elements may share those bits)`,

    'Rate Limiting': `## Definition
**Rate limiting** controls the rate at which a system processes requests, capping requests per time window per user/IP/API key. It prevents abuse, ensures fair resource sharing, protects against DoS attacks, and enforces tier-based quotas (free vs paid).

## Why It Matters
Without rate limiting, one bad actor or buggy client can overwhelm a service. Rate limiting is essential for any public API. Choosing the right algorithm and parameters affects user experience and system protection.

## Detailed Explanation

**Where to rate limit**:
- **API gateway**: Common entry point; central enforcement
- **Load balancer**: Some support basic limits
- **Application code**: Per-feature, fine-grained
- **Database/external service**: Internal protection

**Common algorithms**:

**1. Fixed Window**:
\`\`\`
Limit: 100 requests/minute
Counter resets every minute
Each request: increment counter; if > 100, reject
\`\`\`
- Simple
- **Problem**: Boundary issue. 100 requests at 0:59, then 100 more at 1:00 = 200 in 2 seconds.

**2. Sliding Window Log**:
- Store timestamp of each request
- On new request: count timestamps within last minute; if < limit, accept
- **Pros**: Accurate
- **Cons**: O(N) memory per user

**3. Sliding Window Counter** (compromise):
- Two adjacent fixed windows
- Weighted estimation: count_current + count_previous × (1 - elapsed_in_current_window/window_size)
- Approximation; minimal memory

**4. Token Bucket**:
- Bucket holds N tokens; refills at rate R per second
- Each request consumes 1 token
- If bucket empty, reject
- Allows bursts up to bucket size
- **Most popular algorithm**

**5. Leaky Bucket**:
- Queue of requests
- Server processes at fixed rate (constant outflow)
- Excess requests discarded or queued
- Smooths bursts; predictable output rate

**Token Bucket details**:
\`\`\`
class TokenBucket:
    capacity = 100  # max tokens
    rate = 10       # tokens added per second
    tokens = 100    # current count
    last_refill = now()
    
    def allow(self):
        elapsed = now() - last_refill
        tokens = min(capacity, tokens + elapsed * rate)
        last_refill = now()
        if tokens >= 1:
            tokens -= 1
            return True
        return False
\`\`\`

**Comparison**:

| Algorithm | Burst-friendly | Smooth output | Memory |
|-----------|----------------|---------------|--------|
| Fixed Window | Yes (boundary problem) | No | Low |
| Sliding Log | Yes | No | High |
| Sliding Counter | Yes | No | Low |
| Token Bucket | Yes | No | Low |
| Leaky Bucket | No | Yes | Medium |

**Storage for state**:
- **In-memory** (simple): Lost on restart; doesn't share across instances
- **Redis** (common): Shared across servers; atomic INCR with TTL
- **Distributed** (advanced): Coordinated across DCs

**Distributed rate limiting**:
- Multiple servers must share counter
- Solutions:
  - Redis with INCR + EXPIRE (most common)
  - Token-passing (sticky sessions)
  - Approximate (each server has 1/N of quota)

**Identifying clients**:

| Identifier | Pros | Cons |
|------------|------|------|
| IP address | Simple, no auth needed | Multiple users behind NAT, easily spoofed |
| API key | Fine-grained, traceable | Requires auth |
| User ID | Per-user fairness | Requires auth |
| Combination | Layered defense | Complex |

**Response strategies**:

**1. Reject (HTTP 429 Too Many Requests)**:
- Standard
- Include Retry-After header
- Client should back off

**2. Throttle (slow down)**:
- Process slowly instead of rejecting
- Less common; can cause cascading slowness

**3. Queue**:
- Accept request; process when capacity available
- Useful for inelastic systems (predictable processing)

**Best practices**:
- Communicate limits via response headers (X-RateLimit-*)
- Use HTTP 429 status with Retry-After
- Different limits for different endpoints (cheap reads vs expensive operations)
- Different tiers for different users (free vs paid)
- Monitor and tune limits based on actual traffic

**HTTP headers**:
\`\`\`
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 23
X-RateLimit-Reset: 1612345678
Retry-After: 60
\`\`\`

## Real-World Example
**GitHub API**: 5000 requests/hour for authenticated users, 60/hour unauthenticated. Token bucket. Returns 429 with X-RateLimit-* headers when exceeded.

**Stripe API**: Tiered rate limits per endpoint. Burstable (token bucket allows bursts). Different limits for live vs test mode.

**Cloudflare**: DDoS protection at edge. Rate limits before traffic reaches origin. Can rate limit by URL pattern, header values, etc.

## Interview Tips
- Token bucket is the most popular algorithm
- Fixed window has boundary problem (memorize this)
- Mention Redis for distributed rate limiting
- HTTP 429 with Retry-After is the standard response
- Different limits per endpoint / tier — common in production

## Common Follow-up Questions
1. Token bucket vs leaky bucket? (Token: allows bursts. Leaky: smooths to constant rate)
2. How rate limit across multiple servers? (Centralized counter — Redis common)
3. What's the boundary problem with fixed windows? (2× requests possible at window boundary)`,
    'Idempotency': `## Definition
An **idempotent** operation produces the same result whether executed once or multiple times. If \`f(x)\` is idempotent, then \`f(f(x)) = f(x)\`. In distributed systems, idempotency means a request can be safely retried without unintended side effects (e.g., charging a card twice).

## Why It Matters
Networks fail. Requests time out without confirmation. Without idempotency, retrying causes duplicate effects (double charges, duplicate orders). Idempotency is essential for reliable distributed systems.

## Detailed Explanation

**The retry problem**:
- Client sends request → server processes → response lost in network
- Client doesn't know: did the server succeed?
- Client retries → server processes AGAIN → duplicate effect
- Without idempotency: pay twice, ship twice, etc.

**HTTP method idempotency** (by spec):

| Method | Idempotent? | Safe? |
|--------|-------------|-------|
| GET | Yes | Yes (read-only) |
| HEAD | Yes | Yes |
| PUT | Yes | No |
| DELETE | Yes | No |
| OPTIONS | Yes | Yes |
| POST | NO | No |
| PATCH | NO (usually) | No |

**Why PUT is idempotent**:
- PUT /users/123 with body — replaces resource
- Run once or twice, same final state

**Why POST is NOT**:
- POST /orders creates a new order each time
- 2 calls = 2 orders

**Achieving idempotency**:

**1. Naturally idempotent operations**:
- Setters: \`set status=shipped\` (calling twice = same state)
- Tagged operations: \`add tag X\` (twice = once)
- Counters: NOT idempotent unless you add idempotency keys

**2. Idempotency keys**:
- Client generates UUID per logical operation
- Server records seen keys; on duplicate, returns cached response
- The standard pattern for non-idempotent operations
- Used by Stripe, AWS, etc.

**Idempotency key flow**:
\`\`\`
Client: POST /payments
Headers: Idempotency-Key: abc-123
Body: {amount: 100, card: ...}

Server:
1. Check if abc-123 was processed
2. If yes: return cached response
3. If no: process, store result with key abc-123
4. Return result

Client retries on timeout — server returns cached result, no duplicate charge.
\`\`\`

**Conditional updates** (compare-and-swap):
\`\`\`
PUT /resource
If-Match: "etag-version-5"

Server: only update if current version matches
\`\`\`
- If client retries, etag now mismatches → no double update

**Database-level idempotency**:
\`\`\`
INSERT IGNORE / ON CONFLICT DO NOTHING
\`\`\`
- Insert if not exists; otherwise no-op
- Use natural keys or explicit IDs

**Designing for idempotency**:

**1. Identify the natural ID**:
- Client-generated transaction ID
- Order number
- Email (for "create user")

**2. Store-and-check**:
- Before processing, look up if already done
- If yes, return previous result
- If no, process and store

**3. Atomic check + insert**:
- INSERT INTO operations (id, ...) — fails if id exists
- Use the failure as "already done"

**4. Use UPSERT semantics**:
- INSERT ... ON CONFLICT UPDATE
- Same final state regardless of duplicates

**Common pitfalls**:

**1. Side effects outside DB**:
- Send email + insert user — only DB part is idempotent
- Solution: outbox pattern (record intent in DB, email handled async)

**2. Time-based decisions**:
- "Charge if not charged in last 24h" — depends on time
- Use explicit transaction IDs instead

**3. Order of operations**:
- A then B vs B then A may differ
- Idempotency is per-operation; sequence matters

**4. Idempotency key reuse**:
- Same key, different payload = ambiguous
- Best practice: tie key to specific request body (hash)

**Distributed system implications**:
- Message queues: at-least-once delivery → consumers MUST be idempotent
- Webhooks: receivers MUST be idempotent
- API gateways often add retry logic — backends must handle

**Examples**:

**Stripe API**: Idempotency-Key header. Server caches response for 24 hours. Critical for payments — never charge twice.

**AWS APIs**: Many APIs accept ClientToken for idempotency. RunInstances, CreateBucket, etc.

**SQS**: At-least-once delivery. Consumers must dedupe.

## Real-World Example
**Money transfer**:
- Without idempotency: network blip → retry → \$100 transferred twice
- With idempotency key: server sees same key, returns "already done" — transfer happens exactly once

**E-commerce checkout**:
- User clicks "Place Order"
- Browser sends with idempotency key
- If user double-clicks, second request sees same key, returns "already placed"
- No duplicate orders

**Email send**:
- Send-once semantics: tag email with user_id + email_template + send_date
- Check if record exists before sending

## Interview Tips
- "Idempotent: same effect once or many times"
- HTTP method semantics: GET/PUT/DELETE idempotent, POST not
- Idempotency keys are the practical pattern
- Stripe is the canonical example
- Critical for reliable distributed systems

## Common Follow-up Questions
1. Why is POST not idempotent? (Each POST creates new resource)
2. How implement an idempotency key? (Client generates UUID; server caches result with key)
3. What about messaging? (At-least-once + idempotent consumer = exactly-once effect)`,

    'Circuit Breaker': `## Definition
A **circuit breaker** is a design pattern that prevents cascading failures in distributed systems by detecting when a downstream service is failing and "opening the circuit" — failing fast for new requests instead of waiting for timeouts. After a cooldown period, it tentatively retries to detect recovery.

## Why It Matters
Without circuit breakers, a single slow/failing downstream service can take down the entire system: callers pile up waiting, threads exhaust, then their callers have the same problem. Circuit breakers contain failures.

## Detailed Explanation

**The cascading failure problem**:
1. Service B is overloaded; responses take 30 seconds
2. Service A calls B; threads/connections in A wait
3. A's threads fill up
4. A's callers (service C) also wait → cascade
5. Whole system unresponsive

**Circuit breaker prevents this**: Detect B is unhealthy → fail fast in A → don't pile up.

**The three states**:

**1. Closed** (normal):
- Requests flow through to downstream
- Track failures (count, rate, latency)
- If threshold breached → OPEN

**2. Open** (failing fast):
- Don't make actual calls; immediately return error/fallback
- Wait timeout (e.g., 30 seconds)
- After timeout → HALF-OPEN

**3. Half-open** (testing):
- Allow ONE (or few) request through
- If succeeds → CLOSED (recovery)
- If fails → OPEN (back to failing fast)

**State transitions**:
\`\`\`
Closed --[failure threshold reached]--> Open
Open  --[timeout elapsed]--> Half-Open
Half-Open --[success]--> Closed
Half-Open --[failure]--> Open
\`\`\`

**Configuration**:

**Failure threshold**:
- Count: "5 failures in a row"
- Rate: ">50% failure in window"
- Combined: "X failures AND Y% rate"

**Window**:
- Sliding time window (last 30 seconds)
- Sliding count window (last 100 requests)
- Affects sensitivity vs noise

**Reset timeout**:
- How long to stay open before testing
- Too short: hammer recovering service
- Too long: extend outage

**Pseudocode**:
\`\`\`
class CircuitBreaker:
    state = CLOSED
    failure_count = 0
    threshold = 5
    timeout = 30 # seconds
    last_failure_time = None
    
    def call(self, func):
        if state == OPEN:
            if (now - last_failure_time) > timeout:
                state = HALF_OPEN
            else:
                return fallback()
        
        try:
            result = func()
            if state == HALF_OPEN:
                state = CLOSED
                failure_count = 0
            return result
        except Exception:
            failure_count += 1
            last_failure_time = now
            if failure_count >= threshold:
                state = OPEN
            raise
\`\`\`

**Combined with**:

**Retry**: Attempt N times before giving up. Often used with circuit breaker — but be careful, retries can amplify load.

**Timeout**: Don't wait forever. Always have aggressive timeouts.

**Bulkhead**: Isolate resources per dependency (separate thread pools), so one failure doesn't exhaust shared resources.

**Fallback**: When breaker is open, return cached/default/degraded response. UX better than error.

**Common implementations**:
- **Hystrix** (Netflix, deprecated 2018 but seminal)
- **Resilience4j** (modern Java replacement)
- **Polly** (.NET)
- **gobreaker** (Go)
- **Envoy / Istio** circuit breakers (service mesh)

**When NOT to use**:
- Synchronous internal calls within a process (just use exceptions)
- When fast-fail is worse than slow-success
- Calls that should always be retried (queue messages)

**Antipatterns**:

**1. Too sensitive**: Trips on transient blips, killing throughput.

**2. Too tolerant**: Doesn't trip until system is in crisis.

**3. No fallback**: Just throws errors faster — user still sees failure.

**4. Same breaker for everything**: Should be per-dependency. Failing DB shouldn't trip breaker for cache.

**Service mesh circuit breaking** (Istio/Envoy):
- Deployed as sidecar proxy
- No code changes needed
- Centrally configurable
- Modern preferred approach for microservices

## Real-World Example
**Netflix using Hystrix**: Each external dependency wrapped in circuit breaker. When recommendation service is down, breaker opens; users see fallback (popular content). Service degraded but functional.

**Uber API gateway**: Circuit breakers around each backend service. Breaker open → return cached or degraded response. Prevents one bad service from taking down the app.

**E-commerce checkout**: Payment gateway slow → circuit breaker opens → show "Payments temporarily unavailable, try again" instead of users waiting 60 seconds and seeing timeout.

## Interview Tips
- Three states: Closed/Open/Half-open
- Prevents cascading failures (key benefit)
- Combined with timeout, retry, bulkhead, fallback
- Service mesh (Istio) is modern delivery
- Hystrix is historical reference

## Common Follow-up Questions
1. Why "half-open" state? (Test recovery without flooding the service)
2. Circuit breaker vs retry? (Different patterns; often combined — breaker prevents retry storms)
3. What's a fallback? (Default response when breaker is open — keeps UX functional)`,

    'Service Discovery': `## Definition
**Service discovery** is the mechanism by which services in a distributed system find each other's network locations. Instead of hardcoding IPs/hostnames, services register with a discovery system and clients query it to learn current locations of services they need.

## Why It Matters
In dynamic environments (cloud, Kubernetes), services come and go, scale up/down, and move. Hardcoded addresses don't work. Service discovery is the connective tissue of microservices.

## Detailed Explanation

**The problem**:
- Service A needs to call Service B
- B is running on multiple instances; IPs change with scaling/redeployment
- How does A find B?

**Two main patterns**:

**1. Client-side discovery**:
- Client queries discovery service for B's instances
- Client picks one (load balancing logic)
- Client makes call directly

\`\`\`
Client → Discovery: "where is B?"
Discovery → Client: ["10.0.1.5:8080", "10.0.1.6:8080", "10.0.1.7:8080"]
Client picks one, calls directly
\`\`\`

**Pros**: One less hop; client controls load balancing.
**Cons**: Each client implements discovery logic; tight coupling.
**Examples**: Eureka + Ribbon (Netflix), gRPC name resolver.

**2. Server-side discovery**:
- Client calls a load balancer / router
- LB queries discovery, picks instance
- LB forwards to chosen instance

\`\`\`
Client → LB: "call B"
LB → Discovery: "where is B?"
Discovery → LB: ["10.0.1.5:8080", ...]
LB picks one, forwards request
\`\`\`

**Pros**: Simpler clients; centralized policy; no language-specific libraries.
**Cons**: Extra hop; LB is potential bottleneck.
**Examples**: Kubernetes Services, AWS ELB+target groups, Consul + envoy.

**Service registry**:
- Database of service instances
- Each instance registers on startup, deregisters on shutdown
- Heartbeats / health checks remove dead instances
- Examples: etcd, Consul, ZooKeeper, Eureka

**Registration patterns**:

**Self-registration**:
- Service registers itself on startup
- Sends heartbeats to confirm alive
- Self-deregisters on graceful shutdown
- Risk: ungraceful crash → stale registration

**Third-party registration**:
- External system observes services and registers them
- Kubernetes does this (controller watches pods, updates Services)
- Cleaner; service code doesn't know about discovery

**Health checks**:
- Active: discovery system probes instances
- Passive: instances report (heartbeats)
- Failed checks → instance removed
- Common: HTTP /health endpoint

**DNS-based discovery**:
- Simplest form: services accessible via hostname
- DNS lookup returns instance IPs
- Used by Kubernetes (CoreDNS), Consul DNS interface
- TTL controls how stale results can be

**Kubernetes service discovery**:
- Each Service has a stable virtual IP (ClusterIP)
- DNS: \`my-service.my-namespace.svc.cluster.local\`
- kube-proxy programs iptables/IPVS to forward to current pods
- Pod IPs change; Service IP stable
- Ideal for in-cluster discovery

**Service mesh discovery** (Istio/Envoy):
- Sidecar proxy alongside each service
- Sidecar handles discovery + LB + mTLS + observability
- Service code unchanged
- Modern preferred approach

**Trade-offs**:

| Approach | Complexity | Performance | Cross-language |
|----------|-----------|-------------|----------------|
| Client-side | Higher (per-language libs) | Best (no extra hop) | Hard |
| Server-side | Lower | Slight overhead | Easy |
| DNS-based | Lowest | Good (cached) | Universal |
| Service mesh | Operationally complex | Good | Universal |

**Common implementations**:

| System | Type | Notes |
|--------|------|-------|
| Eureka | Client-side | Netflix's, AP-friendly |
| Consul | Hybrid | Service registry + KV + DNS |
| etcd | Registry only | Used by Kubernetes |
| ZooKeeper | Registry only | Older, complex but proven |
| Kubernetes Services | Server-side / DNS | Cloud-native standard |
| AWS Cloud Map | Hybrid | AWS-native |

**Failure modes**:
- Registry partition: services may fail to discover each other → use cached results, design for staleness
- Stale registrations: dead instances still listed → aggressive health checks
- Registry overload: thousands of services × frequent heartbeats → can hit registry hard

## Real-World Example
**Kubernetes**:
1. Pod \`api-pod-xyz\` starts up
2. Kubelet registers pod IP with API server
3. Endpoints controller updates Service \`api\`'s endpoint list
4. CoreDNS resolves \`api.default.svc.cluster.local\` → ClusterIP
5. kube-proxy DNATs to actual pod IP
6. Client just calls \`http://api/whatever\` — DNS + kube-proxy handle the rest

**Netflix circa 2015**: Eureka registry. Ribbon load balancer in client. Each Java service includes Ribbon — no separate proxy. Client-side LB tuned for AWS region awareness.

**Modern microservices**: Service mesh (Istio). Envoy sidecars handle discovery via xDS protocol. Central control plane pushes config. App developers don't even see the discovery mechanism.

## Interview Tips
- Client-side vs server-side trade-offs
- Kubernetes uses DNS + kube-proxy (server-side)
- Service registry needs to be highly available
- Health checks + heartbeats keep registry fresh
- Service mesh is modern delivery

## Common Follow-up Questions
1. Self-registration vs third-party? (Service registers self, vs external observer)
2. How handle a registry outage? (Cached results, fallback to DNS, design for staleness)
3. Why use service mesh? (Cross-cutting concerns moved out of app code)`,

    'API Gateway': `## Definition
An **API Gateway** is a server that sits between clients and backend services, acting as a single entry point for API requests. It handles cross-cutting concerns: authentication, rate limiting, request routing, response transformation, monitoring, and more — letting backend services focus on business logic.

## Why It Matters
In microservices architectures with many services, exposing each one separately to clients is impractical. API gateways centralize concerns and provide a unified API surface. They're a standard component of modern architectures.

## Detailed Explanation

**Why API gateway**:

**1. Single entry point**:
- Clients connect to one place
- Hide backend topology from clients
- Easy to evolve backend without changing clients

**2. Cross-cutting concerns**:
- Auth, rate limiting, logging — done once at gateway
- Backends focus on business logic

**3. Protocol translation**:
- Client uses REST; backend uses gRPC
- Gateway translates

**4. Aggregation**:
- One client request → fetch from multiple services → merge response
- Reduces client round trips
- BFF (Backend for Frontend) pattern

**5. Versioning**:
- Gateway routes /v1/* to old service, /v2/* to new

**Common features**:

**Authentication & Authorization**:
- Verify tokens (JWT, OAuth)
- Extract user identity, pass to backends
- Reject unauthenticated requests at edge

**Rate limiting / Quotas**:
- Per-user, per-API key limits
- Tier enforcement (free vs paid)
- Protection against abuse

**Request routing**:
- Path-based: \`/users/*\` → user-service
- Header-based: API version, region
- Weight-based: 90% traffic to v1, 10% to v2 (canary)

**Request/response transformation**:
- Add/remove headers
- Modify request body
- Transform between formats (REST ↔ GraphQL ↔ gRPC)

**Caching**:
- Cache responses at gateway
- Reduce backend load
- ETag and conditional GET handling

**Observability**:
- Centralized logging
- Distributed tracing initiation
- Metrics collection (RPS, latency, errors)

**Security**:
- DDoS protection
- IP allow/blocklists
- WAF (Web Application Firewall) integration
- TLS termination

**Compression**:
- gzip/brotli responses
- Reduce bandwidth

**Common API gateway products**:

**Self-hosted**:
- Kong (Lua + nginx)
- Tyk (Go)
- KrakenD
- Apache APISIX

**Cloud-managed**:
- AWS API Gateway
- Google Cloud Endpoints / API Gateway
- Azure API Management
- CloudFlare API Gateway

**Lightweight**:
- nginx + plugins (DIY)
- Envoy (used standalone or in service mesh)
- Traefik

**Architecture patterns**:

**Single gateway**: One entry point for everything. Simple but can become bottleneck.

**Backend-for-frontend (BFF)**: Different gateways for different clients (mobile, web, partner). Each tailored to its client's needs.

**Edge gateway + internal gateways**: Edge handles internet concerns (DDoS, TLS); internal handles routing among services.

**API gateway vs load balancer**:

| Aspect | API Gateway | Load Balancer |
|--------|-------------|---------------|
| Layer | L7 (application) | L4 or L7 |
| Routes by | URL, headers, content | IP, port, basic HTTP |
| Auth | Yes | No (usually) |
| Transformation | Yes | No |
| Per-API limits | Yes | No |

Gateway = LB + lots of features.

**API gateway vs service mesh**:

| Aspect | API Gateway | Service Mesh |
|--------|-------------|--------------|
| Position | Edge (north-south traffic) | Inside (east-west traffic) |
| Use case | Client → services | Service → service |
| Auth | External users | Mutual TLS between services |

Often complementary: gateway at edge, mesh inside.

**Trade-offs**:

**Pros**:
- DRY: one place for cross-cutting concerns
- Easier to evolve backend
- Better security (single attack surface)

**Cons**:
- Single point of failure (need HA)
- Can become a bottleneck
- Adds latency
- Complex configuration
- Risk of "fat gateway" — too much logic

## Real-World Example
**Netflix Zuul/Spring Cloud Gateway**: Single entry point for the Netflix API. Routes requests to ~700 microservices. Handles auth, rate limiting, A/B testing routing.

**AWS API Gateway with Lambda**:
- API Gateway: HTTP endpoint, auth via Cognito
- Routes to Lambda functions (or other backends)
- Built-in rate limiting, caching, monitoring
- Serverless API in minutes

**E-commerce site**:
- Mobile app calls \`/api/v2/products\` → gateway → product service + reviews service + recommendations service → merged response
- Browser calls richer API via different gateway (BFF for web)

## Interview Tips
- Single entry point + cross-cutting concerns = headline
- Mention BFF pattern for mobile/web differentiation
- Gateway vs LB: gateway is L7-rich
- Gateway vs service mesh: edge vs internal
- HA is critical (gateway is potential bottleneck)

## Common Follow-up Questions
1. API gateway vs LB? (Gateway has app-aware features; LB is lower-level)
2. Pros and cons? (Pro: centralized concerns. Con: single point of failure)
3. What's BFF? (Backend for Frontend — gateway tailored per client type)`,

    'CDN (System Design)': `## Definition
A **Content Delivery Network (CDN)** is a geographically distributed network of caching servers that deliver web content from locations close to end users. By serving content from the nearest edge server (PoP — Point of Presence), CDNs reduce latency, offload traffic from origin servers, and improve availability.

## Why It Matters
CDNs are essential for any global-scale application. They cut latency dramatically (often 5-10× improvement), reduce bandwidth costs, absorb DDoS, and improve user experience worldwide.

## Detailed Explanation

**How CDNs work**:

1. Origin server hosts authoritative content (\`origin.example.com\`)
2. CDN has servers worldwide (PoPs)
3. User requests \`example.com/image.jpg\`
4. DNS or HTTP-based routing sends to nearest CDN PoP
5. PoP checks cache:
   - **Hit**: serve from edge (fast)
   - **Miss**: fetch from origin, cache, then serve
6. User gets content from nearest server

**Components**:

**Edge servers (PoPs)**: Geographically distributed caches. Major CDNs: 100+ to 300+ PoPs.

**Origin shield**: Intermediate cache layer that aggregates requests from edges before hitting origin. Reduces origin load.

**Origin**: Authoritative content source. Typically your servers/cloud storage.

**Routing layer**: Determines which PoP serves a user (DNS-based, anycast IP, or HTTP redirect).

**Routing methods**:

**1. DNS-based**:
- DNS returns different IPs based on user's resolver location
- Examples: Akamai (originally), CloudFront
- Pro: Simple. Con: DNS resolver may not be near user.

**2. Anycast**:
- Same IP advertised from many locations via BGP
- Internet routing picks nearest
- Examples: Cloudflare, Fastly, Google CDN
- Pro: Per-request routing. Con: Less control.

**3. HTTP redirect**:
- Initial request redirected to specific PoP
- Pro: Fine control. Con: Extra round trip.

**Caching specifics**:

**TTL (Time-To-Live)**:
- How long edge keeps content
- Set via Cache-Control header
- Long TTL = better hit rate but staler content

**Cache headers**:
\`\`\`
Cache-Control: public, max-age=3600
Cache-Control: no-store  (don't cache)
Cache-Control: private (don't cache in CDN)
ETag: "abc123"  (content version)
Last-Modified: Wed, 21 Oct 2025...
\`\`\`

**Cache key**:
- What identifies a cached object
- Default: URL
- Customizable: include/exclude query params, vary on headers
- Bad cache key = cache misses or wrong content

**Purge / invalidate**:
- Force-refresh content
- Per-URL or pattern (\`/blog/*\`)
- Async (eventual) or sync (per-PoP confirmation)

**Cache types**:

**Static content** (images, CSS, JS): Long TTL, easy to cache.

**Dynamic content**: Short TTL or no cache. Some CDNs cache personalized content with edge logic.

**Streaming**: HLS/DASH chunks cached at edge. Live streams trickier.

**Beyond caching** — modern CDN features:

**Edge compute**: Run code at the edge.
- Cloudflare Workers, Lambda@Edge, Fastly Compute@Edge
- Personalize, A/B test, modify requests/responses without origin round trip
- Sub-50ms response times globally

**Image optimization**: Transform images (resize, format) on the fly.

**DDoS protection**: Absorb attacks at edge before reaching origin.

**WAF (Web Application Firewall)**: Layer 7 attack protection.

**Bot management**: Distinguish humans from bots.

**Analytics**: Real-time traffic insights.

**Push vs Pull CDNs**:

**Pull CDN** (most common):
- Origin is "pulled" lazily on cache miss
- First request slow; subsequent fast
- Easy to set up

**Push CDN**:
- Content uploaded to CDN ahead of time
- All requests fast
- More work to manage
- Used for: video streaming, large downloads

**Common CDN providers**:
- Cloudflare (anycast, WAF, workers)
- Akamai (oldest, enterprise)
- Fastly (developer-focused, very fast purge)
- AWS CloudFront (deep AWS integration)
- Google Cloud CDN
- Bunny CDN, KeyCDN (smaller, cheaper)

**Trade-offs**:

**Pros**:
- Latency: orders of magnitude better
- Bandwidth: offload from origin (90%+ typical)
- Reliability: edge keeps serving if origin down
- DDoS protection
- Cost: often net savings (bandwidth from CDN cheaper than origin)

**Cons**:
- Cache invalidation complexity
- Privacy: CDN sees user traffic
- Vendor lock-in
- Costs (though often net positive)

## Real-World Example
**E-commerce static assets**:
- product-image-123.jpg: cached for 30 days at CDN edge
- 99% of requests served from edge — origin gets only 1%
- Latency: 20ms (edge) vs 200ms (origin in distant region)
- Bandwidth costs cut dramatically

**Netflix Open Connect**: Custom CDN with PoPs in ISP networks. Pre-positioned popular content. Massive scale — Netflix is ~15% of internet traffic, all from Open Connect.

**Cloudflare Workers**: API responds in <50ms globally. Worker code runs at 250+ PoPs. Personalize at edge without trip to origin.

## Interview Tips
- "Cache content at edge close to users"
- Anycast routing is the modern approach
- Cache headers (Cache-Control, ETag) determine TTL
- Edge compute is the modern frontier
- DDoS protection is a major secondary benefit

## Common Follow-up Questions
1. How does CDN know nearest server? (Anycast routing or DNS-based geographic mapping)
2. Cache invalidation? (Purge by URL/pattern; async to all PoPs)
3. What's edge compute? (Run code at CDN PoPs — personalize without trip to origin)`,

    'Database Replication': `## Definition
**Database replication** is the process of copying data from one database (primary/master) to one or more replica databases (replicas/slaves) to provide redundancy, distribute read load, enable failover, and support geographic distribution.

## Why It Matters
Replication is the foundation of high-availability and read-scalability. Almost every production database uses replication. Understanding modes and trade-offs is essential for system design.

## Detailed Explanation

**Why replicate?**

**1. High availability**: Primary fails → replica takes over (failover).

**2. Read scalability**: Read queries distributed across replicas.

**3. Disaster recovery**: Geographic replicas survive regional outages.

**4. Backup**: Replicas serve as live backups.

**5. Reporting / analytics**: Long queries on replica don't affect primary.

**Replication topologies**:

**1. Primary-Replica (Master-Slave)**:
- One primary handles writes
- One or more replicas mirror primary
- Reads from any node
- Standard pattern

**2. Multi-Primary (Master-Master)**:
- Multiple nodes accept writes
- Conflicts possible (same key written on different nodes)
- Used in geographic deployments
- Examples: BDR for PostgreSQL, MySQL Group Replication

**3. Cascading**:
- Primary → Replica1 → Replica2 (replica replicates to other replicas)
- Reduces load on primary
- Can be used to span regions

**4. Hub-and-spoke**:
- Many primaries replicate to a central hub
- Used for aggregating data from many sources

**Replication modes**:

**1. Synchronous**:
- Primary waits for replica(s) to confirm write before responding
- Strong consistency on replicas
- Slower writes (waits for slowest replica)
- Used for: critical data, hot standby

**2. Asynchronous**:
- Primary writes, returns; replicates in background
- Faster writes
- Risk: replica lag → reading replica may show stale data
- Risk: primary crash before replication → data loss

**3. Semi-synchronous**:
- Wait for at least ONE replica to acknowledge
- Compromise: faster than full sync, safer than async
- Common in MySQL

**Replication mechanisms**:

**1. Statement-based**:
- Replicate the SQL statements
- Pros: compact log
- Cons: non-deterministic functions (NOW(), RAND()) cause issues

**2. Row-based**:
- Replicate the actual row changes
- Larger log but deterministic
- More common today

**3. WAL/log-based**:
- Replicate the write-ahead log entries
- Used by PostgreSQL streaming replication
- Very efficient

**4. Logical**:
- Higher-level changes (e.g., insert row X)
- Allows different schemas, partial replication
- PostgreSQL logical replication, MySQL row-based

**Replica lag**:
- Time between write on primary and visibility on replica
- Async replication has unbounded lag
- Causes: network latency, replica busy with reads, large transactions
- Monitor and alert on lag

**Read after write consistency**:
- User writes to primary, immediately reads
- If reads from replica with lag → user sees old data!
- Solutions:
  - Read your own writes from primary (need to track)
  - Sticky reads (route to primary briefly after write)
  - Wait for replication confirmation
  - Read from "session replica" guaranteed up to date

**Failover**:

**Automatic**:
- System detects primary failure
- Promotes a replica to primary
- Updates routing
- Risk: split-brain (two primaries during partition)

**Manual**:
- Operator triggers failover
- Slower but safer

**Promotion process**:
1. Detect primary down (health checks)
2. Choose replica with most recent data
3. Promote: replica becomes new primary
4. Update DNS/proxy/connection strings
5. Reconfigure remaining replicas to follow new primary
6. (Old primary, when it returns, becomes a replica)

**Common database replication**:

| Database | Default mode | Notes |
|----------|--------------|-------|
| MySQL | Async | Row or statement; semi-sync available |
| PostgreSQL | Async streaming | Sync available; logical replication too |
| MongoDB | Async (replica sets) | Auto-failover; configurable write concerns |
| Redis | Async | Replication for HA via Sentinel/Cluster |
| Cassandra | Tunable per query | Quorum-based |

**Multi-region considerations**:
- Cross-region replication adds significant lag (10-100ms)
- Network costs
- May need active-passive (one region primary)
- Or active-active with conflict resolution (complex)

**Conflict resolution** (multi-master):
- Last-write-wins (timestamps)
- Application-specific merge
- CRDTs (conflict-free replicated data types)
- Multi-value (keep all versions)

## Real-World Example
**E-commerce site on AWS RDS**:
- Primary in us-east-1 (writes)
- Read replica in us-east-1 (reports, analytics)
- Read replica in us-west-2 (DR + west coast reads)
- Async replication (write fast)
- Promote DR replica if east coast is down

**MongoDB replica set**:
- 3 nodes: 1 primary, 2 secondaries
- Async replication via oplog
- Primary failure: secondaries vote, one becomes new primary
- Auto-failover in seconds

**Spanner / CockroachDB**: Multi-region, multi-master with strong consistency via Paxos/Raft. Comes at performance cost (network round trips).

## Interview Tips
- Sync vs async is the headline distinction
- Replica lag is critical practical concern
- Read-after-write consistency is a common gotcha
- Failover process — know the steps
- Multi-master = conflict resolution challenges

## Common Follow-up Questions
1. Sync vs async? (Sync: stronger consistency, slower; async: faster, possible data loss)
2. What's replica lag? (Time between write on primary and visibility on replica)
3. How handle failover? (Detect failure, promote replica, update routing)`,
    'Eventual Consistency (System Design)': `## Definition
**Eventual consistency** is a consistency model in distributed systems where, given no new updates, all replicas of a piece of data will eventually converge to the same value. There's no guarantee of when this happens — only that it will. It trades immediate consistency for higher availability and lower latency.

## Why It Matters
Eventual consistency is the default for many large-scale systems (DynamoDB, Cassandra, S3 historically, DNS). Understanding when it's acceptable — and when it's not — is critical for system design.

## Detailed Explanation

**The promise**:
- After a write, replicas may briefly disagree
- No new writes → all replicas converge
- "Eventually" is unbounded but typically milliseconds-to-seconds in practice

**Where you encounter it**:
- DNS (TTL-based caching means changes propagate slowly)
- AWS S3 (eventually consistent for overwrites until 2020)
- Cassandra (default writes)
- Multi-region databases
- CDN cache invalidation
- Email replication

**Stronger guarantees on top of eventual**:

**Read-your-writes (RYW)**:
- After YOU write, YOU see your writes
- Others may not yet
- Implementation: route your subsequent reads to primary, or to replica known to have your update

**Monotonic reads**:
- If you saw value X, you won't subsequently see an older value
- Prevents "going back in time"

**Causal consistency**:
- If write A causally precedes B, all observers see A before B
- Captures "if you saw the comment, you also saw the post"

**Session consistency**:
- Within a session, RYW + monotonic reads
- A common practical guarantee

**Implementing eventual consistency**:

**Async replication**:
- Write to one node
- Replicate to others in background
- Replicas have varying lag

**Gossip protocol**:
- Nodes periodically exchange state with random neighbors
- Information spreads exponentially
- Used by Cassandra, Riak

**Anti-entropy / read repair**:
- During reads, if replicas disagree, reconcile
- Background process compares and fixes

**Conflict resolution**:

**Last-Write-Wins (LWW)**:
- Use timestamps; latest wins
- Simple but loses updates
- Clock skew is a problem

**Vector clocks**:
- Track happens-before relationships
- Detect concurrent updates
- App or system handles conflicts

**CRDTs (Conflict-free Replicated Data Types)**:
- Mathematical structures that always merge cleanly
- Counters, sets, maps with deterministic merge
- Used by Riak, Redis, collaborative editors

**When eventual consistency is OK**:

**1. Read-heavy with infrequent writes**:
- News articles, blog posts
- A few seconds of staleness fine

**2. Counters where exact count not critical**:
- Like counts, view counts (off-by-one acceptable)

**3. User profile updates**:
- New avatar showing 5 seconds late: fine

**4. Search indexes**:
- Just-posted item not in search for a few seconds: fine

**5. Caches**:
- Inherently eventually consistent

**When eventual consistency is NOT OK**:

**1. Financial transactions**:
- Account balance, transfers
- Need strong consistency

**2. Inventory**:
- Selling more units than available
- Need atomic decrement

**3. Authentication**:
- Password change shouldn't allow old password to work

**4. Distributed locks**:
- Two clients can't both think they have the lock

**Mitigations / hybrid approaches**:

**Read from primary for critical**: Most reads from replica; balance changes go to primary.

**Tunable consistency** (Cassandra, DynamoDB):
- Per-query consistency level
- Strong for important; eventual for everything else

**Compensation / refund logic**: Detect and fix inconsistencies after the fact.

**User-perceived consistency**: 
- Reflect user's own actions immediately in UI (optimistic update)
- Reconcile in background
- User feels system is consistent

## Real-World Example
**Twitter timeline**: When you tweet, your followers may see it appearing at slightly different times. Eventual consistency. Tweet count may be off momentarily. Fine for the use case.

**S3 (pre-2020)**: After overwriting a file, GET could briefly return old content. Caused real bugs in workflows. Amazon eventually moved to strong consistency.

**DynamoDB defaults to eventual**: Reads cheaper and faster. For critical reads, request "strongly consistent" — costs 2× and slower.

**Shopping cart (Amazon's classic example)**: Add item works; items may have multiple versions during partition. Show user a merged cart with their items — eventual consistency reconciled at read.

## Interview Tips
- "Replicas converge eventually, no timing guarantee"
- Trade-off: availability/performance for stronger consistency
- Read-your-writes is critical for UX
- LWW is simple but lossy; CRDTs are elegant
- Banking = no, social = yes is a useful framing

## Common Follow-up Questions
1. Eventual vs strong consistency? (Eventual: replicas converge. Strong: all see latest immediately)
2. What's read-your-writes? (You see your own writes; others may not yet)
3. How resolve conflicts? (LWW, vector clocks, CRDTs, app-specific merge)`,

    'Two-Phase Commit': `## Definition
**Two-Phase Commit (2PC)** is a distributed transaction protocol that ensures all participants in a transaction either commit or abort together, achieving atomicity across multiple databases or services. A coordinator orchestrates two phases: prepare (vote) and commit (execute).

## Why It Matters
2PC is the classical solution for distributed transactions. Understanding it explains why it's both fundamental and problematic — and why modern systems often use sagas instead.

## Detailed Explanation

**Participants**:
- **Coordinator**: Orchestrates the protocol
- **Participants** (resources): Databases, services involved in the transaction

**Phase 1: Prepare**:
1. Coordinator sends PREPARE to all participants
2. Each participant:
   - Performs the transaction work
   - Writes to durable log (so it can complete or abort even after restart)
   - Holds locks
   - Replies VOTE-COMMIT or VOTE-ABORT
3. Coordinator waits for all responses

**Phase 2: Commit**:
1. If ALL voted COMMIT:
   - Coordinator sends COMMIT to all
   - Participants commit, release locks, ack
2. If ANY voted ABORT (or timeout):
   - Coordinator sends ABORT to all
   - Participants roll back, release locks, ack

**Properties**:

**Atomicity**: All commit or all abort. Cannot have partial commits (in normal operation).

**Blocking**: If coordinator fails after participant has voted COMMIT but before sending decision, participant is stuck. Holds locks indefinitely.

**Failure scenarios**:

**1. Participant fails before voting**:
- Coordinator times out → ABORT
- OK

**2. Participant fails after voting COMMIT, before receiving decision**:
- On recovery, participant doesn't know the outcome
- Must ask coordinator (or other participants)
- This is the BLOCKING case

**3. Coordinator fails after sending some COMMITs**:
- Some participants committed; others may not know
- Can lead to inconsistency
- Mitigated by: persistent coordinator log; recovery protocol

**4. Network partition**:
- Coordinator can't reach some participants
- Locks held; no progress

**Performance**:
- Slow: 2 round trips (prepare + commit)
- Locks held for entire duration
- Latency = max(participant latency) × 2

**3PC** (Three-Phase Commit):
- Adds a "pre-commit" phase to reduce blocking
- Less blocking but assumes synchronous network with bounded delays
- In practice, real networks violate assumptions
- Rarely used

**Comparison with alternatives**:

| Approach | Atomicity | Performance | Complexity |
|----------|-----------|-------------|------------|
| 2PC | Yes | Slow | Medium |
| Saga | Eventually | Fast | High (compensations) |
| Eventual + idempotent | None | Fast | Low |
| Distributed transactions (Spanner) | Yes | Medium (TrueTime) | Very high (infra) |

**When 2PC is used**:
- Within a single database (XA transactions)
- Tightly-coupled internal services
- Where atomicity is non-negotiable
- Example: bank transfer between accounts in different DBs

**When 2PC is avoided**:
- Microservices (sagas preferred)
- High-throughput systems (locks too costly)
- Systems with frequent partial failures
- Cross-service transactions

**Why microservices avoid 2PC**:
- Every involved service has to support 2PC (XA support)
- Performance cost
- Coordinator failure can hang multiple services
- Cloud-native preference for loose coupling
- Saga pattern decomposes into local transactions + compensations

**XA standard**:
- Open standard for distributed transactions
- Java has JTA (Java Transaction API)
- Most databases support XA
- Used in enterprise integration / app servers

**Modern alternatives**:

**Saga pattern**: Sequence of local transactions; compensating transactions on failure. Eventual consistency.

**Distributed transactions via consensus** (Spanner, CockroachDB): Use Paxos/Raft + clocks. Strong consistency, scales but complex infrastructure.

**Outbox pattern**: Atomic local DB write + event emission. No 2PC needed for cross-service.

**Idempotent design**: Each step idempotent; system recovers from partial failures via retry.

## Real-World Example
**Bank transfer between two databases**:
1. Coordinator: "Subtract \$100 from account A. Add \$100 to account B."
2. Phase 1: Both DBs prepare; both vote COMMIT
3. Phase 2: Both DBs commit
4. Atomicity preserved even across DB boundaries

**Microservices order placement (using saga, not 2PC)**:
1. Create order (local txn)
2. Charge payment (local txn) — if fails, cancel order (compensation)
3. Reserve inventory (local txn) — if fails, refund payment + cancel order
4. Notify shipping
5. Each step is local; failures handled with compensations

## Interview Tips
- 2PC = atomicity across distributed resources
- Two phases: prepare (vote) + commit
- BLOCKING is the key flaw
- Modern microservices prefer sagas over 2PC
- Mention XA standard for enterprise

## Common Follow-up Questions
1. Why is 2PC "blocking"? (Coordinator failure can leave participants stuck holding locks)
2. 2PC vs saga? (2PC: atomic but blocking. Saga: eventual consistency, no global locks)
3. What's 3PC? (Adds extra phase to reduce blocking; assumes synchronous network — rarely practical)`,

    'Saga Pattern': `## Definition
The **Saga pattern** is a way to manage data consistency across multiple services in a distributed system, especially microservices, without using distributed transactions. A saga is a sequence of local transactions; if any step fails, compensating transactions undo the previous steps.

## Why It Matters
Sagas enable distributed transactions without the blocking problems of 2PC. They're the standard pattern for long-running cross-service workflows in microservices and event-driven systems.

## Detailed Explanation

**The problem sagas solve**:
- Order placement spans: payment, inventory, shipping services
- Want: all-or-nothing semantics
- 2PC works but: requires all services support it, locks resources, blocking
- Saga: decompose into local transactions + compensating actions

**Two coordination styles**:

**1. Choreography (event-driven)**:
- No central coordinator
- Each service publishes events; others subscribe and react
- Decentralized, loosely coupled
- Hard to track state of overall workflow

**Example flow**:
\`\`\`
OrderService creates order → emits OrderCreated
PaymentService listens → charges → emits PaymentSucceeded (or PaymentFailed)
InventoryService listens to PaymentSucceeded → reserves → emits InventoryReserved
ShippingService listens → ships
\`\`\`

If payment fails:
\`\`\`
PaymentService emits PaymentFailed
OrderService listens → cancels order
\`\`\`

**Pros**:
- Simple coupling (just events)
- Each service self-contained
- Resilient (no central coordinator)

**Cons**:
- Hard to visualize/track
- Risk of cyclic dependencies
- Complex testing

**2. Orchestration (commanded)**:
- Central orchestrator service
- Sends commands to participants
- Tracks state of overall saga

**Example flow**:
\`\`\`
Orchestrator:
  1. Tell PaymentService: charge
  2. PaymentService: charged
  3. Tell InventoryService: reserve
  4. If fails: tell PaymentService: refund
  5. Otherwise: tell ShippingService: ship
\`\`\`

**Pros**:
- Easier to understand and debug
- Centralized state
- Good for complex workflows

**Cons**:
- Orchestrator becomes complex
- Coupling (services know orchestrator commands)

**Compensating transactions**:
- Reverse the effect of a step
- Must be IDEMPOTENT (may be retried)
- Must be COMMUTATIVE in some senses (order may vary)
- Examples:
  - "Charge \$100" → "Refund \$100"
  - "Reserve 5 items" → "Release 5 items"
  - "Send confirmation email" → "Send cancellation email"

**Note**: Compensations are SEMANTIC undos, not exact rollbacks. The system progresses through forward and backward states; outsiders may have observed intermediate states.

**Failure types**:

**Transient failures**: Retry (with backoff).

**Permanent failures**: Trigger compensation (cancel saga).

**Compensation failures**: Hardest — manual intervention may be needed.

**Saga vs 2PC**:

| Aspect | 2PC | Saga |
|--------|-----|------|
| Consistency | Atomic (all or nothing) | Eventually consistent |
| Locking | Holds locks | Local locks only |
| Blocking | Yes (coordinator failure) | No |
| Complexity | Coordinator + participants | Each service + compensations |
| Performance | Slower (locks) | Faster |
| Visibility of intermediate state | No | Yes |
| Compensations | None | Required |

**Properties of sagas**:

**ACD (no I — no isolation)**:
- Atomic? Eventually (with compensations)
- Consistent? At end
- Durable? Yes (each step durable)
- Isolated? NO — other transactions may see intermediate state

**Implications**:
- Concurrent sagas can interleave
- Reads may show inconsistent intermediate states
- Need careful design (e.g., reservations to prevent overselling)

**Implementation patterns**:

**State machine**: Saga is a state machine; transitions on events. Tools: AWS Step Functions, Temporal, Camunda.

**Outbox + event-driven**: Each service writes to local DB + outbox table; outbox emitted as events to others.

**Saga frameworks**:
- **Temporal**: Workflow engine; durable execution; retries; compensations.
- **AWS Step Functions**: State machine in cloud
- **Camunda**: BPMN-based workflow engine
- **Axon Framework** (Java): Saga support for event-sourced systems

**Common pitfalls**:

**1. Forgetting compensations**: Every step must have a defined undo.

**2. Non-idempotent compensations**: Retried compensation could overshoot.

**3. Pivot transactions**: Some steps can't be undone (e.g., physical shipping). Design to put irreversible step last.

**4. State management**: Track what step the saga is on; what's been compensated.

**5. Timing**: How long can a saga run? Days? Hours? Affects state storage.

## Real-World Example
**Travel booking**:
1. Reserve flight → if fails, abort
2. Reserve hotel → if fails, cancel flight
3. Reserve car → if fails, cancel hotel + flight
4. Charge total → if fails, cancel all reservations
5. Send confirmation

Each step has a compensating action. Saga ensures: either user has all 4 reservations or none.

**E-commerce order processing** (orchestrated):
- OrderService starts the saga
- Sequence: Validate → Charge → Reserve inventory → Ship
- Each step's failure triggers compensations of preceding steps
- Customer gets refund + cancellation if any step fails

**Uber ride matching**: Rider request + driver assignment + payment auth + ride completion + payment capture. Saga across multiple services. Compensations: cancel ride, refund.

## Interview Tips
- Saga = distributed transactions WITHOUT 2PC's blocking
- Choreography vs orchestration trade-off
- Compensations must be designed (and idempotent)
- No isolation — intermediate states visible
- Mention Temporal/Step Functions as modern tooling

## Common Follow-up Questions
1. Choreography vs orchestration? (Decentralized events vs central coordinator)
2. What's a compensating transaction? (Action that semantically undoes a previous step)
3. Why no isolation? (No locking across saga; concurrent sagas may interleave)`,

    'CQRS': `## Definition
**Command Query Responsibility Segregation (CQRS)** is an architectural pattern that separates operations that modify state (commands) from operations that read state (queries) into different models. The write model is optimized for transactional consistency; the read model is optimized for query performance — and they can use different data stores.

## Why It Matters
CQRS enables independent scaling and optimization of reads and writes. It's a powerful pattern for high-scale systems where read and write workloads have very different characteristics — common in event-driven and microservices architectures.

## Detailed Explanation

**Traditional CRUD**:
- Same model for reads and writes
- Same database
- Simple but limits flexibility

**CQRS**:
- **Command model**: Handles writes; ensures business rules; emits events
- **Query model**: Handles reads; optimized for query patterns; eventually consistent
- Two separate models, often two separate stores

**Architecture diagram**:
\`\`\`
                 ┌──────────┐
   Commands ──→ │ Command  │ ──→ Write Store
   (writes)    │  Handler │     (normalized)
                └────┬─────┘
                     │ events
                     ▼
                ┌──────────┐
   Queries  ──→ │  Query   │ ←── Read Store
   (reads)     │  Handler │     (denormalized,
                └──────────┘      query-optimized)
\`\`\`

**Why split**:

**Different access patterns**:
- Writes: 1% of traffic, must be consistent and validated
- Reads: 99% of traffic, must be fast — often joined/aggregated

**Different scaling**:
- Reads can be horizontally scaled with caches and replicas
- Writes need a single source of truth

**Different schemas**:
- Writes: normalized for integrity (3NF)
- Reads: denormalized for speed (one row per UI screen)

**Common pairings**:

| Use case | Write store | Read store |
|----------|-------------|------------|
| E-commerce | PostgreSQL | Elasticsearch (search) + Redis (cart) |
| Social feed | Cassandra | Redis (timeline cache) |
| Analytics | Kafka log | OLAP (Druid, ClickHouse) |
| User profile | RDBMS | Read replicas + caching |

**Synchronization** (write → read):

**1. Synchronous (transactional)**:
- Update both stores in same transaction
- Strong consistency
- Hard if different stores; usually only within same DB

**2. Asynchronous (event-driven)**:
- Write side emits events
- Read side consumes events, updates projection
- Eventually consistent
- Most common

**3. Periodic batch**:
- Read store rebuilt from write store periodically
- Used for analytical reads
- Coarse-grained

**CQRS + Event Sourcing**:
- Often paired
- Events from event sourcing → projections to read stores
- Each projection optimized for specific queries
- Can rebuild read store from events at any time

**Advantages**:

**1. Independent scaling**: Scale reads (replicas, caches) and writes (sharding) separately.

**2. Optimized models**: Each model designed for its purpose.

**3. Flexibility**: Multiple read models for different views (e.g., user-facing UI + analytics dashboard).

**4. Performance**: Denormalized read store eliminates joins.

**5. Polyglot persistence**: Use right tool for each job.

**Disadvantages**:

**1. Complexity**: Two systems to maintain.

**2. Eventual consistency**: User makes write, immediate read might see old data. Requires UX consideration.

**3. Sync overhead**: Events must propagate; risk of bugs in synchronization.

**4. Steep learning curve**: Different from familiar CRUD.

**When to use CQRS**:
- High-scale read/write asymmetry
- Complex domain with rich queries
- Already using event-driven architecture
- Multiple read views needed

**When NOT to use**:
- Simple CRUD apps
- Small teams without distributed systems experience
- Strict read-after-write requirements

**Common patterns**:

**Read your own writes**:
- Cache user's writes briefly on write side
- Or route their reads to write store for short period
- Mitigates eventual consistency for user's own actions

**Multiple projections**:
- One write side; many read sides
- Each read store specialized: search, analytics, timeline, etc.
- Add new read views without changing writes

**Materialized views** (similar concept in databases):
- Pre-computed query results stored
- Refreshed on data changes
- A simpler form of CQRS

## Real-World Example
**E-commerce**:
- Write side: PostgreSQL — transactions for orders, inventory
- Read side 1: Elasticsearch — product search and filtering
- Read side 2: Redis — shopping cart, sessions
- Read side 3: Snowflake — analytics dashboards
- Events from PostgreSQL via change data capture (Debezium) → Kafka → all read stores

User places order → PostgreSQL updated → event emitted → all read stores eventually updated. UI initially shows order from optimistic update; backend confirms within seconds.

**Banking**:
- Write side: traditional RDBMS — strong consistency for balance, transactions
- Read side: pre-computed account summaries, transaction history with categorization
- Read store much faster than computing summaries on demand

**Twitter timeline**:
- Write side: tweets stored in normalized form
- Read side: pre-computed timelines per user (push model)
- Tweets fan out on write to followers' timelines
- Read = simple lookup of pre-computed list

## Interview Tips
- "Separate read and write models"
- Often paired with event sourcing
- Eventual consistency is the cost
- Multiple read views = key advantage
- Don't recommend for simple CRUD

## Common Follow-up Questions
1. CQRS vs CRUD? (CQRS: separate models for read/write; CRUD: same model for both)
2. When NOT to use? (Simple apps; small teams; need strict read-after-write)
3. How sync write to read? (Events typically; eventually consistent)`,

    'Event Sourcing': `## Definition
**Event Sourcing** stores the state of a system as a sequence of immutable events rather than just the current state. To get current state, you replay all events. To audit, you read the event log. This pattern provides full history, time-travel queries, and natural integration with event-driven systems.

## Why It Matters
Event sourcing offers powerful properties: complete audit trail, ability to derive new views from history, and natural support for distributed systems. It's a cornerstone of CQRS, DDD (Domain-Driven Design), and many modern architectures.

## Detailed Explanation

**Traditional CRUD**:
- Database stores current state
- UPDATE replaces previous values
- History lost (unless explicit audit table)

**Event Sourcing**:
- Append-only log of events
- Each event = "something happened" (immutable, past tense)
- Current state = function of all events: \`state = fold(events)\`
- "What is X's balance?" = sum all credit/debit events for X

**Example: bank account**:

CRUD approach:
\`\`\`
account_id | balance
123        | 500
\`\`\`

Event-sourced approach:
\`\`\`
event_id | account_id | type     | amount
1        | 123        | Created  | 0
2        | 123        | Deposit  | 200
3        | 123        | Deposit  | 400
4        | 123        | Withdraw | 100
\`\`\`
Current balance = 0 + 200 + 400 - 100 = 500.

**Properties**:

**1. Full history**: Every change preserved.

**2. Audit**: "Who did what when" is trivially queryable.

**3. Temporal queries**: "What was the balance on Jan 1?" — replay events up to that date.

**4. Debugging**: Reproduce bugs by replaying events.

**5. New projections**: Want a new analysis? Replay events to compute it.

**6. Event-driven friendly**: Events naturally publishable to other systems.

**Components**:

**Event store**: Append-only log of events. Examples: Kafka, EventStore (specialized), DynamoDB.

**Aggregate**: Domain object whose state is built from events. Has methods that emit new events on commands.

**Projections / read models**: Computed from events; optimized for queries. CQRS pattern.

**Snapshot**: Periodically save aggregate state to avoid replaying ALL events.

**Event handler / processor**: Subscribes to events, builds projections or triggers other actions.

**Typical write flow**:
\`\`\`
1. Receive command (e.g., "Withdraw \$100")
2. Load aggregate (replay events for account 123)
3. Validate command (sufficient funds?)
4. If valid: emit "Withdrawn" event
5. Append event to store
6. (Async) projections update read models
\`\`\`

**Typical read flow** (if using CQRS):
\`\`\`
1. Query the read model (already projected)
2. Return result
\`\`\`

**Snapshots**:
- After 1 million events, replay too slow
- Periodically save aggregate state: "Snapshot at event 1000: balance = X"
- Load snapshot + replay events since
- Common heuristic: snapshot every 100 events or so

**Schema evolution** (events change over time):
- Old events have old schemas
- Handlers must support old AND new versions
- **Up-casting**: Transform old events to new format on read
- **Versioning**: Tag each event with schema version

**Benefits**:

**1. Audit trail**: Compliance, debugging, troubleshooting.

**2. Reconstruct any state**: Including derived/aggregate states.

**3. Decouples write and read**: Different views from same source of truth.

**4. Natural event-driven**: Events become the integration mechanism.

**5. Domain alignment**: Events are business-domain concepts ("OrderShipped", not "row updated").

**Drawbacks**:

**1. Complexity**: Big mental shift; harder than CRUD.

**2. Storage**: Stores grow indefinitely (mitigated by snapshots, archive).

**3. Schema evolution**: Old events still need to be deserialized.

**4. Eventual consistency**: Read models lag.

**5. Querying**: Can't easily query the event store directly; need projections.

**6. GDPR / right to delete**: Immutable events conflict with deletion mandates. Solutions: encrypt with per-user key, then "forget" by destroying key.

**Combined with CQRS**:
- Most natural pairing
- Events from write side → multiple projections for reads
- Each projection optimized for specific queries
- Adding new view = replay history into new projection

**Tools / frameworks**:
- **EventStoreDB**: Purpose-built event store
- **Apache Kafka**: Used as event store with Kafka Streams
- **Axon Framework** (Java): Event sourcing + CQRS
- **DynamoDB Streams**: Event-like log with DynamoDB
- **Marten** (.NET): Postgres-backed event sourcing

**Antipatterns**:

**1. Storing CRUD events**: "EntityUpdated" with full new state — defeats purpose. Events should be domain-meaningful.

**2. No snapshots**: Replaying millions of events on every read is impractical.

**3. Event store as queryable database**: It's an append-only log; build projections for queries.

**4. Mutating events**: Events are immutable. Need correction? Add a corrective event.

**5. Without good observability**: Without tooling, debugging event flows is hard.

## Real-World Example
**Banking system**: Every transaction is an event. Account balance derived. Audit trail is automatic. Fraud detection runs on event stream. Reporting and analytics are projections.

**E-commerce orders**:
- Events: OrderCreated, ItemAdded, PaymentReceived, OrderShipped, ItemReturned
- Order status = fold(events)
- "What was the order's state on July 4?" — replay to that date
- New analytics? Replay all order events into new model

**Git**: A famous example of event sourcing! Git stores commits (events); current files are projections.

**Banking core systems**: Most modern core banking platforms are event-sourced. Required by regulation for full audit trail.

## Interview Tips
- "Store events, not state"
- Replay events to get current state
- Snapshots address replay performance
- Often paired with CQRS
- Strong audit/compliance benefit
- Mention Kafka or EventStoreDB

## Common Follow-up Questions
1. Why event sourcing? (Audit trail, time-travel, multiple projections, event-driven integration)
2. Why snapshots? (Replaying millions of events is slow; snapshot reduces work)
3. How handle GDPR delete? (Encrypt per-user, "forget" by destroying key)`,

    'Pub/Sub': `## Definition
**Publish/Subscribe (Pub/Sub)** is a messaging pattern where senders (publishers) emit messages without knowing who receives them, and receivers (subscribers) declare interest in topics or message types without knowing who publishes. A broker delivers messages from publishers to all interested subscribers.

## Why It Matters
Pub/sub is fundamental to event-driven architectures, real-time systems, and decoupled services. It enables loose coupling, fan-out, and scalability — essential for modern distributed systems.

## Detailed Explanation

**Core concepts**:
- **Publisher**: Emits messages. Doesn't know subscribers.
- **Subscriber**: Receives messages. Doesn't know publisher.
- **Topic / Channel**: Named category of messages.
- **Broker**: Routes messages from publishers to subscribers.

**Flow**:
\`\`\`
Publisher → Broker (publishes to "orders" topic)
                ↓
            ┌───┴───┐
        Subscriber A   Subscriber B   ← both receive each message
\`\`\`

**Pub/sub vs message queue**:

| Aspect | Pub/Sub | Message Queue |
|--------|---------|---------------|
| Delivery | All subscribers get each message | One consumer gets each message |
| Use case | Broadcasting events | Distributing work |
| Subscribers | Many | Many (workers) |
| Each message | Many copies (one per subscriber) | One copy (work item) |

**Push vs pull**:

**Push**: Broker pushes to subscribers as messages arrive. Lower latency. Subscriber may be overwhelmed.

**Pull**: Subscribers poll broker for messages. Subscriber controls rate. Higher latency. Used by Kafka.

**Topic-based vs content-based**:

**Topic-based**: Subscribers declare interest in named topics ("orders", "users"). Broker routes by topic. Most common.

**Content-based**: Subscribers declare predicates ("amount > 1000"). Broker filters by content. More flexible, more expensive.

**Common patterns**:

**Fan-out**: One publisher → many subscribers. Notify all interested parties.

**Fan-in**: Many publishers → one subscriber. Aggregate from many sources.

**Topic hierarchies**: \`orders.created\`, \`orders.shipped\`, \`orders.canceled\`. Subscribe to all "orders.*" or specific.

**Subscriber types**:

**Stateless**: Process message, done. Easy to scale.

**Stateful**: Build up state over messages. Harder to scale; partitioning may be needed.

**Filtered**: Subscribe with filter expression. Broker only delivers matching messages.

**Reliability semantics**:

**At-most-once**: May lose; never duplicate. Fast.

**At-least-once**: May duplicate; never lose. Common. Subscribers must be idempotent.

**Exactly-once**: Hard. Approximated via idempotency or transactional brokers.

**Ordering**:
- Per-topic: usually preserved
- Per-partition: preserved within partition; not across
- Global ordering: hard, expensive

**Common pub/sub systems**:

| System | Notes |
|--------|-------|
| Apache Kafka | Topic + partitions; durable log; very high throughput |
| RabbitMQ | Exchanges + queues; flexible routing |
| AWS SNS | Managed topic service; pushes to many subscribers |
| Google Cloud Pub/Sub | Managed; high scale; at-least-once |
| NATS / NATS JetStream | Lightweight; very fast |
| Redis Pub/Sub | Fire-and-forget; lightweight |
| MQTT | Optimized for IoT, lightweight devices |

**Kafka specifics**:
- Topics divided into partitions
- Each partition is an ordered log
- Subscribers (consumer groups) read from partitions
- Within a consumer group, each partition assigned to one consumer (work distribution)
- Across consumer groups: each gets full topic copy (pub/sub fan-out)
- This gives both queue-like AND pub/sub-like semantics

**Use cases**:

**Event notifications**:
- "User signed up" → notify email, analytics, CRM services

**Real-time updates**:
- Stock price changes → notify all watching clients

**Decoupled microservices**:
- Order service emits events; payment, inventory, shipping services react

**Real-time analytics**:
- Click events streamed → aggregations computed live

**IoT**:
- Sensors publish data; many subscribers analyze

**Cache invalidation**:
- Database changes published → caches subscribe and invalidate

**Trade-offs**:

**Pros**:
- Loose coupling
- Easy fan-out
- Scalable
- Add subscribers without changing publishers

**Cons**:
- Eventual consistency
- Debugging across decoupled flows is harder
- Schema evolution affects all subscribers
- Message ordering issues
- Subscribers may go down — messages back up

**Critical questions for design**:
- Persistence: messages durable, or volatile?
- Ordering: per-topic, per-key, none?
- Replay: can subscribers re-read?
- Filtering: where does it happen (broker or subscriber)?
- Scale: throughput goals; partitioning?

## Real-World Example
**E-commerce platform**:
- OrderService publishes "OrderPlaced" event
- Subscribers: PaymentService (charges card), InventoryService (reserves stock), EmailService (sends confirmation), AnalyticsService (logs metric), FraudService (checks for fraud)
- Each subscriber has independent processing; failures isolated

**Stock trading**:
- Exchange publishes price updates
- Many client apps subscribe; each gets all updates
- Real-time charts powered by pub/sub

**Slack messages**:
- New message published → server fans out to all clients in channel
- WebSockets used for client subscriptions

**Twitter (firehose)**: Tweets published to massive pub/sub. Indexers, analytics, search, recommendations all subscribe.

## Interview Tips
- Pub/sub = decoupled fan-out
- Different from queues (queue = work distribution; pub/sub = broadcasting)
- Kafka does both with consumer groups
- Subscribers must be idempotent (at-least-once)
- Topic vs partition vs consumer group is Kafka model

## Common Follow-up Questions
1. Pub/sub vs queue? (Pub/sub: many get copy. Queue: one consumer per message)
2. How handle subscriber slowness? (Backpressure, persistent queue, ack rate)
3. What about ordering? (Per-topic or per-partition typically; global is hard)`,
    'Webhooks vs Polling': `## Definition
**Polling** is when a client repeatedly asks a server "is there new data?" at intervals. **Webhooks** are reverse — the server CALLS the client (via HTTP request) when new data is available, eliminating the need for repeated polling. Each has its place; webhooks are the push, polling is the pull.

## Why It Matters
The choice affects latency, scalability, and complexity for cross-system integration. Most modern APIs offer webhooks for efficiency; polling remains useful in some scenarios.

## Detailed Explanation

**Polling**:

**How**:
- Client makes HTTP requests at intervals: "any new data?"
- Server responds with new data or "nothing yet"
- Client repeats

**Variants**:

**Short polling**:
- Frequent requests (e.g., every 5 seconds)
- Each request returns immediately
- Wasteful: most return nothing

**Long polling**:
- Client sends request; server holds connection open until data available (or timeout)
- More efficient; latency low when data arrives
- Connection-intensive on server

**Pros of polling**:
- Simple to implement
- Works through firewalls/NATs (just HTTP)
- Client controls timing
- Stateless on server (no need to track clients)

**Cons of polling**:
- Wastes bandwidth/CPU when no updates
- Latency: data delayed up to polling interval
- Doesn't scale well (many clients × frequent requests)

**Webhooks**:

**How**:
- Client (subscriber) registers a callback URL with server (provider)
- When event occurs, server makes HTTP POST to callback URL
- Subscriber processes the request

**Setup flow**:
\`\`\`
1. App registers webhook: POST /webhooks {"url": "https://myapp.com/hook", "events": ["order.created"]}
2. Provider stores: "When order.created, POST to https://myapp.com/hook"
3. Event happens
4. Provider POSTs: {"event": "order.created", "data": {...}}
5. App's webhook handler processes
\`\`\`

**Pros of webhooks**:
- Real-time delivery (no polling delay)
- Efficient (no useless requests)
- Scalable (events only when needed)

**Cons of webhooks**:
- Requires public endpoint (firewall issues)
- Handling reliability is on receiver
- Order/duplicate handling: receiver must be idempotent
- Receiver downtime causes missed events (mitigated by retries)
- Security: must verify request authenticity (signed payloads)

**Comparison**:

| Aspect | Polling | Webhooks |
|--------|---------|----------|
| Latency | Up to interval | Near real-time |
| Server-side cost | High (handle frequent requests) | Low (only on events) |
| Receiver cost | Always making requests | Only when event fires |
| Network usage | High (lots of "no data" responses) | Minimal |
| Setup complexity | Trivial | Need public endpoint |
| Reliability | Inherently retried | Need explicit retry logic |
| Behind firewall | Works | Doesn't work |

**Hybrid: long polling**:
- Best of both for real-time when webhooks impossible
- Client opens HTTP request; server holds until event
- When event, server responds; client immediately re-opens
- Used when receiver can't expose endpoint (browsers, mobile apps)

**WebSockets / SSE**: True bidirectional / streaming alternative for long-running browser connections.

**Webhook reliability patterns**:

**1. Retries**: Provider retries on failure (e.g., 5xx, timeout). Exponential backoff.

**2. Signing**: Provider signs payload with secret; receiver verifies. Prevents spoofing.

**3. Idempotency**: Receiver must handle duplicates (same event may be delivered twice).

**4. Event IDs**: Each event has unique ID for dedup.

**5. Event log**: Receiver may not always be up; log of recent events helps catch up.

**6. Order handling**: Webhooks may arrive out of order. Use timestamps/sequence numbers if order matters.

**Webhook security**:

**Signed requests**:
\`\`\`
Provider:
  signature = HMAC(secret, body)
  POST /hook
  Header: X-Signature: <signature>
  Body: <payload>

Receiver:
  Compute HMAC(secret, body); compare to header
  If matches, accept; else reject
\`\`\`
Used by Stripe, GitHub, Slack, etc.

**IP allowlist**: Some providers publish their webhook IP ranges; receiver only accepts from those.

**HTTPS only**: Encrypt payload + auth header.

**When to use what**:

**Use webhooks when**:
- Receiver has public HTTPS endpoint
- Real-time latency matters
- Provider supports them
- Events are infrequent (don't waste bandwidth polling)

**Use polling when**:
- Receiver behind NAT/firewall
- Provider doesn't support webhooks
- Retrieving large bulk data periodically
- Want to control timing
- Simple implementation > efficiency

**Modern APIs**:
- Stripe, GitHub, Slack, Twilio: webhooks
- Banking APIs (slow-moving): polling common
- IoT: MQTT (pub/sub, push-based)

## Real-World Example
**Stripe payments**: When a customer pays, Stripe webhooks your server with payment.succeeded. You update order status. Real-time, no polling.

**GitHub CI/CD**: Push code → GitHub webhook to Jenkins → Jenkins runs build. Without webhook: Jenkins would have to poll GitHub every minute.

**Polling for bank balance**: Many banking apps poll for account updates because real-time push from banks is rare. Annoying but unavoidable.

**Slack bots**: Messages sent → Slack webhooks your bot. Bot responds. No polling needed.

## Interview Tips
- Webhooks = push (real-time, efficient)
- Polling = pull (simple, works through firewalls)
- Long polling = compromise
- Webhooks need: idempotent handlers, signing, retry-aware receivers
- Receiver behind firewall? Polling/long-polling/WebSocket required.

## Common Follow-up Questions
1. Why not always webhooks? (Receiver must have public endpoint; can't always)
2. Webhook reliability? (Provider retries with exponential backoff; receiver idempotent)
3. How prevent webhook spoofing? (HMAC-signed payloads with shared secret)`,

    'Long Polling vs WebSockets': `## Definition
**Long polling** is an HTTP-based technique where a client sends a request that the server holds open until data is available, then responds. **WebSockets** is a bidirectional, persistent connection protocol that enables full-duplex communication between client and server over a single TCP connection. Both achieve real-time delivery, but with different trade-offs.

## Why It Matters
Real-time features (chat, notifications, live updates) need server-to-client push. Choosing between long polling and WebSockets affects performance, scalability, and complexity. Modern apps often use WebSockets, but long polling has its place.

## Detailed Explanation

**Long polling**:

**How**:
1. Client sends HTTP request
2. Server holds connection open until:
   - Data available → respond with data
   - Timeout (e.g., 30s) → respond empty, client retries
3. Client receives response, immediately opens new request
4. Repeats indefinitely

**Pros**:
- Works through any HTTP infrastructure (proxies, firewalls)
- Compatible with HTTP/1.1 and HTTP/2
- Easy to implement (just HTTP)
- Stateless (mostly)

**Cons**:
- Each event = separate HTTP request (overhead)
- Unidirectional (server → client); for client → server, need separate request
- Connection re-established frequently
- Delay between response and new request (small but exists)

**WebSockets**:

**How**:
1. Client initiates HTTP request with "Upgrade: websocket" header
2. Server agrees; connection becomes WebSocket
3. Connection persists; bidirectional messages flow as frames
4. Either side can send anytime

**WebSocket handshake**:
\`\`\`
Client:
GET /chat HTTP/1.1
Host: server.com
Upgrade: websocket
Connection: Upgrade
Sec-WebSocket-Key: <random>
Sec-WebSocket-Version: 13

Server:
HTTP/1.1 101 Switching Protocols
Upgrade: websocket
Connection: Upgrade
Sec-WebSocket-Accept: <derived from key>

[connection now WebSocket — frames flow]
\`\`\`

**Pros**:
- Full-duplex (both directions any time)
- Low overhead (no HTTP headers per message)
- Real-time
- Standard browser API

**Cons**:
- Stateful (server must maintain connection)
- Doesn't work through every proxy (older proxies)
- More complex to scale
- Need to handle disconnects/reconnects in app code

**Comparison**:

| Aspect | Long Polling | WebSockets |
|--------|--------------|------------|
| Direction | Server → Client | Bidirectional |
| Connection | Many short | One persistent |
| Overhead per message | HTTP headers | Minimal frame |
| Latency | Low (poll → response) | Lower (no setup) |
| Compatibility | Universal | Most browsers; some proxies issue |
| Server resources | Many connections during hold | One per client |
| State | Stateless-ish | Stateful |
| Use case | Notifications, simple updates | Chat, gaming, live data |

**Server-Sent Events (SSE)**: Another option — HTTP-based, server-to-client push, stays open. Simpler than WebSockets when you only need server-to-client.

**WebSocket scaling challenges**:

**Sticky connections**: Each client tied to one server (where its WS connection lives). LB needs sticky session or pub/sub backend.

**Memory**: Each open connection = some RAM. 100K connections × 8KB = 800MB. Plan capacity.

**Reconnection**: Networks drop. Client must reconnect; might lose messages.

**Backpressure**: If client slow, server's send buffer fills.

**Pub/sub backend**: With horizontal scaling, server A has half the clients, server B the other half. Message published by client on A; need to deliver to clients on B. Solution: Redis pub/sub, NATS, or similar broker connects servers.

**Connection management patterns**:

**Heartbeat**:
- Periodic ping/pong to detect dead connections
- Detects half-open TCP

**Reconnect with backoff**:
- On disconnect, retry with exponential backoff
- Avoid hammering server during outages

**Message queues**:
- Store messages while client offline
- Resume where left off on reconnect

**Authentication**:
- Initial HTTP handshake can carry auth (cookie, header, query param)
- Once upgraded, can't easily change

**WebSocket libraries**:
- **Socket.IO**: Adds reconnection, fallback to long polling, rooms
- **WebSocket native**: Browser API
- **ws** (Node.js)
- **uWebSockets.js**: Very fast
- **ActionCable** (Rails): WebSocket framework
- **Phoenix Channels** (Elixir): Used for massive concurrent connections

**Use cases**:

**Long polling fits**:
- Notifications (low frequency)
- Dashboard updates
- Where infrastructure doesn't support WebSockets

**WebSockets fit**:
- Chat applications (Slack, Discord)
- Multiplayer games
- Live trading dashboards
- Collaborative editing (Google Docs)
- Live sports scores
- Video call signaling

**SSE fits**:
- Server-to-client only
- Simpler than WebSockets
- News feeds, status updates, log streaming

**HTTP/2 & HTTP/3**:
- HTTP/2 multiplexing reduces some need for WebSockets (but still no server push to clients)
- HTTP/3 (QUIC): faster connection setup, no head-of-line blocking
- WebSockets over HTTP/2 (RFC 8441): combines benefits

## Real-World Example
**Slack**:
- Uses WebSockets for messages, typing indicators, presence
- Falls back to long polling if WebSockets blocked
- Each Slack workspace has thousands of concurrent WS connections

**Stock trading platforms**: WebSockets for price ticks. Latency is money.

**Web chat support**: Often Socket.IO with WebSocket primary, long polling fallback.

**GitHub Actions logs**: Streams via SSE. Server pushes log lines; client doesn't need to send back.

**Online multiplayer game**: WebSockets for low-latency, bidirectional commands and state updates.

## Interview Tips
- Long polling = HTTP-based, server-to-client push only
- WebSockets = persistent bidirectional
- WebSockets are stateful (scaling challenge)
- SSE is a third option for server-to-client only
- Mention sticky connections + pub/sub backend for WS scaling

## Common Follow-up Questions
1. WebSockets vs long polling? (Persistent + bidirectional vs HTTP-based + server-push only)
2. How scale WebSockets? (Sticky LB + pub/sub backend across servers)
3. SSE vs WebSockets? (SSE: server-to-client only, simpler. WS: bidirectional, more complex)`,

    'Horizontal vs Vertical Scaling': `## Definition
**Vertical scaling (scaling up)** means adding more resources (CPU, RAM, faster disk) to a single machine. **Horizontal scaling (scaling out)** means adding more machines to share the load. Each has different cost, complexity, and limits.

## Why It Matters
The scaling approach defines your architecture's complexity, cost, and ultimate ceiling. Modern cloud-native systems prefer horizontal; understanding the trade-offs is foundational.

## Detailed Explanation

**Vertical scaling**:

**How**: Move from a 4-core / 16GB box to an 8-core / 32GB box. Same software, more resources.

**Pros**:
- Simple — no architecture changes
- No coordination overhead
- Faster per-operation (no network)
- Strong consistency easy (single machine)
- Some workloads can ONLY scale this way (traditional RDBMS)

**Cons**:
- **Hard upper limit**: Biggest machine on the market is the cap
- **Expensive**: Top-tier hardware costs disproportionately
- **Single point of failure**: One machine = one failure point
- **Downtime to upgrade**: Reboot to add resources
- **Wasted capacity**: Scale to peak; idle most of the time

**Horizontal scaling**:

**How**: Run 5 small machines instead of 1 big one. Distribute load across them.

**Pros**:
- **(Nearly) unlimited**: Add machines as needed
- **High availability**: Lose one, others continue
- **Commodity hardware**: Cheap parts; cloud-friendly
- **Granular**: Add/remove instances based on load
- **Geographic distribution**: Spread machines across regions

**Cons**:
- **Complexity**: Distributed systems are hard
- **Coordination**: Synchronizing data across nodes
- **Network overhead**: Inter-node communication
- **Consistency challenges**: CAP theorem implications
- **Operational burden**: Many machines to manage

**Comparison**:

| Aspect | Vertical | Horizontal |
|--------|----------|------------|
| Direction | Up (bigger) | Out (more) |
| Limit | Hardware ceiling | (Nearly) unlimited |
| Cost curve | Exponential | Linear-ish |
| Complexity | Low | High |
| Failure | Single SPOF | Resilient |
| Downtime to scale | Yes (reboot) | No |
| Suitable for | Stateful, hard-to-distribute | Stateless, distributable |
| Network overhead | None | Yes |

**Common patterns**:

**Vertical for**:
- Traditional RDBMS (PostgreSQL primary)
- Legacy applications
- Specialized hardware (GPUs)
- Applications hard to parallelize

**Horizontal for**:
- Stateless web/API servers (the obvious fit)
- Caches (Redis cluster, Memcached)
- NoSQL databases (Cassandra, DynamoDB)
- Big data processing (Spark, Hadoop)
- Microservices

**Hybrid approach (most common)**:
- Vertically scale individual machines to a reasonable point
- Horizontally scale the fleet
- E.g., 16-core servers × 100 of them, instead of 1600-core mega-server (impossible) or 1-core × 1600 (network overhead)

**Stateless vs stateful**:
- Stateless: easy to scale horizontally
- Stateful: harder — data must be sharded or replicated
- Move state out of servers (to DB, cache) → stateless servers easy to scale

**Database scaling**:

**Vertical**:
- Bigger machine
- Read replicas (some horizontal)
- Limit: typically TBs of data, single-digit thousands of QPS

**Horizontal**:
- Sharding (partition data)
- Distributed databases (Cassandra, DynamoDB)
- Complexity: cross-shard transactions, joins

**Modern reality**: Cloud has made vertical scaling have softer limits (huge instances available), but truly massive scale still requires horizontal.

**Auto-scaling**:
- Horizontal scaling triggered by metrics (CPU, requests/sec)
- Add instances during traffic spikes
- Remove during quiet times
- AWS Auto Scaling, Kubernetes HPA, etc.

**Cost consideration**:

**Vertical**:
- Linear at low end; exponential at high end
- 64-core: 8× the cost of 8-core (not just 8×)
- Specialized hardware (GPU, NVMe) compounds cost

**Horizontal**:
- Linear cost (mostly)
- Volume discounts in cloud
- Spot/preemptible instances cheaper

**Cloud-native preference**: Modern architectures heavily prefer horizontal.

**Why horizontal preferred**:
- Resilience (no single point of failure)
- Cost-efficiency at scale
- Elasticity (scale dynamically)
- Geographic distribution

**Challenges to mitigate for horizontal**:
- State management → externalize to DB/cache
- Inter-service communication → tolerate latency
- Consistency → choose appropriate model
- Operations → automation, observability

## Real-World Example
**Stack Overflow**: Famously runs on a small fleet of beefy servers (vertical scaling). Their workload (heavy reads, well-cached) suits this. Counter-example to "everything must be horizontal".

**Twitter, Facebook, Google**: Massively horizontally scaled. Many small/medium machines. State sharded across hundreds/thousands of nodes.

**Database evolution**:
- Startup: single PostgreSQL instance (vertical)
- Growth: read replicas + bigger primary (mostly vertical)
- Scale: shard PostgreSQL or migrate to distributed DB (horizontal)
- Mega-scale: Spanner, CockroachDB, or custom (horizontal with strong consistency at cost)

**Auto-scaling group**: Web tier deployed as 5 instances; ASG configured to scale up to 50 during traffic spikes. Horizontal elasticity.

## Interview Tips
- "Up vs out" — memorable framing
- Vertical = simpler, hits ceiling
- Horizontal = more complex, scales further
- Stateless services = horizontal-friendly
- Modern cloud-native = horizontal first
- Mention Stack Overflow as vertical-scaling counter-example

## Common Follow-up Questions
1. Why prefer horizontal? (No ceiling, resilience, cost-efficiency at scale)
2. What's hard about horizontal? (State management, coordination, complexity)
3. How databases scale? (Vertical to a point; then read replicas, sharding, distributed DBs)`,

    'Stateless vs Stateful': `## Definition
A **stateless** service does not retain client information between requests — each request is independent and contains all needed context. A **stateful** service maintains client-specific information across requests (in-memory or on-disk). The distinction massively affects scalability, reliability, and architectural complexity.

## Why It Matters
Statelessness is the foundation of cloud-native scalability. Many architectural decisions hinge on whether services are stateless. Knowing how to make services stateless is a key skill.

## Detailed Explanation

**Stateless**:
- No memory of previous requests
- Any instance can handle any request
- Easy to add/remove instances
- Each request is self-contained

**Stateful**:
- Has session, cache, in-memory data
- Future requests depend on past state
- Routing matters (sticky sessions)
- Harder to scale, restart, or recover

**Examples**:

**Stateless**:
- REST APIs that read from DB
- Pure function HTTP handlers
- Lambda/serverless functions
- Static file servers
- Most modern web servers

**Stateful**:
- Database servers
- Session stores
- WebSocket connections
- Game servers (player positions)
- Stateful microservices (in-memory caches, queues)

**Why stateless wins (for scaling)**:

**1. Horizontal scaling**: Add instances; LB routes anywhere. No coordination.

**2. Fault tolerance**: Instance dies; another picks up immediately.

**3. Auto-scaling**: Add/remove instances based on load without data migration.

**4. Deployment**: Roll out new versions, drain old, no state loss.

**5. Caching**: All instances see same DB; no inconsistent state.

**6. Simplicity**: Each request self-contained; easier to reason about.

**Making services stateless**:

**Externalize state**:
- Sessions → Redis or DB
- File uploads → S3 or shared storage
- In-memory caches → distributed cache (Memcached, Redis)
- Long-running operations → queues + workers

**Pass state in requests**:
- Auth: JWTs (state in token, not server memory)
- Pagination cursors
- Workflow context

**Examples**:

**BAD (stateful)**:
\`\`\`
class UserSession:
  user_id = None
  cart_items = []
  preferences = {}

# Server keeps state per user; LB must route same user to same server
\`\`\`

**GOOD (stateless)**:
\`\`\`
# Each request includes auth token; server fetches needed state from DB/cache
def handle_request(request):
    user_id = decode_jwt(request.headers["Auth"])
    cart = redis.get(f"cart:{user_id}")
    # process and respond
\`\`\`

**Stateful systems are needed**:

**1. Databases**: Are inherently stateful. Made highly available via replication, failover.

**2. Caches**: Stateful, but sharded for scale.

**3. WebSocket connections**: Each client tied to one server. Need pub/sub backend for inter-server messaging.

**4. Long-lived workflows**: Use durable workflow engines (Temporal, AWS Step Functions).

**5. Real-time games**: Player state in memory for low latency.

**Trade-offs**:

| Aspect | Stateless | Stateful |
|--------|-----------|----------|
| Scaling | Easy horizontal | Hard (state migration) |
| Failover | Trivial | Complex |
| Deployment | Rolling, blue-green | Care needed |
| Performance | DB hit per request | In-memory fast |
| Complexity | Lower | Higher |
| Routing | LB anywhere | Sticky sessions |

**Sticky sessions**:
- LB routes same user to same server
- Hack to add state to "stateless" architecture
- Anti-pattern in cloud-native — defeats horizontal scaling
- Use cases: when state truly local (e.g., WebSocket per node)

**Stateful architecture patterns**:

**Single primary + replicas**: Database pattern. Writes go to primary, reads can hit replicas.

**Sharding**: State partitioned across instances. Each shard has subset.

**Consistent hashing**: Map state to nodes such that adding/removing nodes minimally redistributes.

**Replication + consensus**: Multiple instances hold same state; consensus (Paxos, Raft) keeps consistent.

**Event-sourced**: Stateful "logically", but state derived from event log; can rebuild.

**Twelve-Factor App**:
- Factor VI: "Processes" — apps execute as one or more stateless processes
- State stored in backing services (DBs, caches)
- Foundation of cloud-native design

**Kubernetes**:
- Stateless: Deployment (any pod equivalent)
- Stateful: StatefulSet (stable IDs, persistent volumes per pod)
- StatefulSet for databases, queues, etc.

**Comparing tools**:

| Tool | State |
|------|-------|
| Lambda / Cloud Functions | Stateless (must be) |
| EC2/VM with traditional app | Often stateful |
| Kubernetes Deployment | Stateless |
| Kubernetes StatefulSet | Stateful |
| Redis | Stateful |
| Cassandra | Stateful (sharded) |
| Service Workers (Cloudflare) | Stateless |

## Real-World Example
**E-commerce architecture**:
- Web tier: stateless. Auto-scales 5-50 instances.
- Session state: Redis cluster (stateful, but isolated).
- Database: PostgreSQL primary + replicas (stateful, managed for HA).
- File uploads: S3 (stateful storage, managed by AWS).
- Result: web tier scales effortlessly.

**Game server**:
- Stateful by nature (player positions, game world)
- Scaled by spawning new game instances per match/server
- Match-making routes player to specific instance

**API gateway**:
- Stateless front-end: any instance handles any request
- Auth: validate JWT (state in token)
- Rate limiting state: shared in Redis
- Result: highly scalable

## Interview Tips
- "Stateless = scale-friendly" is the headline
- Externalize state (sessions in Redis, files in S3)
- JWT tokens carry state in the request
- Sticky sessions are anti-pattern (most of the time)
- Some things must be stateful (DBs, caches) — design carefully

## Common Follow-up Questions
1. Why prefer stateless? (Easy horizontal scaling, fault tolerance, cloud-native fit)
2. How handle session in stateless? (Externalize: Redis, DB, or JWT in request)
3. When stateful is necessary? (Databases, caches, WebSockets, real-time games)`,

    'Session Management': `## Definition
**Session management** is how a server identifies and maintains state for a user across multiple requests in HTTP, which is inherently stateless. Common approaches include server-side sessions (with session IDs), token-based authentication (JWTs), and cookie-based mechanisms.

## Why It Matters
Sessions touch every authenticated app. Choices here affect security, scalability, and user experience. Common pitfalls (insecure cookies, JWT leak, session fixation) are real attack vectors.

## Detailed Explanation

**The HTTP problem**: HTTP is stateless. After each request, server forgets the client. But apps need "logged in" state across requests.

**Solutions**:

**1. Server-side sessions**:

**How**:
1. User logs in
2. Server generates session ID (random)
3. Server stores session in memory/DB (session_id → user_id, etc.)
4. Server sends session ID to client (cookie)
5. Client sends cookie with each request
6. Server looks up session ID → loads user state

**Pros**:
- Server controls session (can revoke instantly)
- Sensitive data not exposed to client
- Easy to update session data

**Cons**:
- Server-side state (challenges horizontal scaling)
- Storage required (DB or cache)
- Session lookup on every request

**Storage**:
- In-memory: simple, doesn't survive restart
- Redis: fast, distributable, common choice
- Database: persistent, slower

**2. Token-based (e.g., JWT)**:

**How**:
1. User logs in
2. Server generates JWT (signed payload with claims like user_id, exp)
3. Sends JWT to client
4. Client sends JWT in header (Authorization: Bearer <jwt>)
5. Server validates signature; trusts claims

**Pros**:
- Stateless on server (no session storage)
- Scales horizontally easily
- Self-contained (claims in token)

**Cons**:
- Hard to revoke before expiry (need denylist)
- Larger than session ID (whole payload + sig)
- Security risk if leaked
- Should not store sensitive data in JWT (signed, not encrypted)

**3. Cookie-based**:
- Cookies are how sessions/tokens typically arrive at server
- Browser sends them automatically
- Various flags affect security:
  - **HttpOnly**: JavaScript can't read (XSS protection)
  - **Secure**: HTTPS only
  - **SameSite**: CSRF protection (Strict, Lax, None)
  - **Domain/Path**: Scope of cookie

**4. OAuth tokens**:
- For 3rd-party access
- Access token (short-lived) + refresh token (longer-lived)
- Discussed in OAuth-specific topics

**Comparison**:

| Approach | State on server | Revoke easily | Scales easily |
|----------|----------------|---------------|---------------|
| Server session | Yes | Yes | With shared store |
| JWT | No | Hard | Yes |
| Hybrid | Yes (denylist) | Yes | With cache |

**Security concerns**:

**1. Session hijacking**: Attacker steals session ID/cookie, impersonates user.
- Mitigations: HTTPS, HttpOnly cookies, IP/UA binding (with caution)

**2. Session fixation**: Attacker forces user to use known session ID.
- Mitigation: Regenerate session ID on login

**3. CSRF (Cross-Site Request Forgery)**: Attacker tricks user's browser into making authenticated request.
- Mitigations: SameSite cookies, CSRF tokens, double-submit cookies

**4. XSS (Cross-Site Scripting)**: Attacker injects JS that steals tokens.
- Mitigations: HttpOnly cookies, input sanitization, CSP

**5. JWT secret leakage**: Server's signing key leaks → attacker forges tokens.
- Mitigation: Strong key, key rotation, monitoring

**Session lifecycle**:

**Login**: Create session/token.
**Active use**: Validate on each request.
**Refresh**: Extend lifetime (sliding expiration) or refresh tokens.
**Logout**: Invalidate session/token.
**Expiration**: Auto-expire after timeout.

**Sliding vs absolute expiration**:

**Sliding**: Each activity extends session. Inactive timeout. Common for UX.

**Absolute**: Fixed lifetime regardless of activity. Forces periodic re-auth.

**Best practice**: Combination — sliding within an absolute max.

**Refresh tokens**:
- Short-lived access token (e.g., 15 min)
- Long-lived refresh token (e.g., 7 days)
- Refresh exchanges old → new access token
- Refresh tokens can be rotated (single-use) for additional security
- Limits damage of access token leak

**Single sign-on (SSO)**:
- One login works across multiple apps
- SAML, OAuth, OpenID Connect
- Identity provider (IdP) handles auth; apps trust IdP

**Practical recipe**:

**For typical web app**:
- Use server-side sessions backed by Redis
- Cookies: HttpOnly + Secure + SameSite=Lax
- CSRF protection (token or SameSite=Strict)
- Sliding 30-min timeout, absolute 24-hour max
- Logout invalidates session
- Login regenerates session ID

**For mobile/SPA app**:
- JWT for access (15 min), refresh token (7 days, single-use rotated)
- HTTPS only
- Protect tokens in secure storage (Keychain on iOS, Keystore on Android)
- Web: avoid localStorage for tokens (XSS risk); use HttpOnly cookies if possible

**For microservices**:
- API gateway validates token at edge
- Internal services trust gateway (or re-validate token)
- mTLS or signed claims pass user identity between services

## Real-World Example
**Banking website**: Server-side sessions in Redis. 5-minute idle timeout. HTTPS only. Re-auth required for sensitive actions. Logout immediately invalidates session.

**Mobile API (Spotify, etc.)**: JWT access tokens (1 hour) + refresh tokens. Tokens in secure mobile storage. Refresh in background.

**SaaS dashboard**: HttpOnly cookies + CSRF tokens. SameSite=Lax. Browser auto-sends cookie; CSRF token validates intent.

**SSO across apps**: Login once at idp.company.com → access wiki, jira, github via SAML/OIDC. Each app validates assertion from IdP.

## Interview Tips
- Server sessions vs JWT: state vs stateless trade-off
- Cookies need: HttpOnly, Secure, SameSite
- Refresh tokens limit access token leak damage
- CSRF and XSS are session attack vectors
- Banking/sensitive: server sessions; SPA/mobile: JWT often

## Common Follow-up Questions
1. Server session vs JWT? (Server: state in DB, easy revoke. JWT: stateless, hard revoke)
2. Why HttpOnly? (JS can't access; protects against XSS-stealing cookie)
3. Why refresh tokens? (Short-lived access reduces leak window; refresh allows long sessions safely)`,

    'Hot/Cold Storage': `## Definition
**Hot storage** is data accessed frequently — kept in fast, expensive storage (RAM, SSD, premium cloud tiers). **Cold storage** is data accessed rarely — kept in slow, cheap storage (HDDs, tape, archival cloud tiers). Tiered storage strategies match access patterns to storage cost, balancing performance and budget.

## Why It Matters
Storage costs scale with data growth. Without tiering, you pay premium prices for old, rarely-touched data. Tiering can reduce storage costs by 80%+ for typical workloads.

## Detailed Explanation

**Storage hierarchy** (fastest to slowest, expensive to cheap):

| Tier | Latency | Cost (relative) | Examples |
|------|---------|----------------|----------|
| RAM | Nanoseconds | $$$$$ | Server RAM, ElastiCache |
| NVMe SSD | Microseconds | $$$$ | Local NVMe, AWS io2 |
| SSD | Microseconds | $$$ | EBS gp3, Azure Premium SSD |
| HDD | Milliseconds | $$ | EBS st1, Azure Standard HDD |
| Object storage (hot) | Tens of ms | $$ | S3 Standard, GCS Standard |
| Object storage (warm) | Hundreds of ms | $ | S3 Standard-IA, S3 Intelligent-Tiering |
| Cold object | Seconds | $ (1/4 of hot) | S3 Glacier, Glacier Deep Archive |
| Archival | Hours to retrieve | Cheapest | S3 Glacier Deep Archive, Tape |

**Use cases**:

**Hot storage**:
- Active database
- Recent user data
- Live application state
- Active analytics datasets
- High-traffic CDN content

**Warm storage**:
- 30-90 days old transactional data
- Less-accessed user content
- Logs older than a few weeks

**Cold storage**:
- Years-old transactional records
- Compliance / audit logs
- Old emails, photos, videos
- Backups (older than recent recovery window)
- Regulatory retention (medical, legal)

**Strategies**:

**1. Lifecycle policies (cloud)**:
- Auto-transition based on age:
  - 0-30 days: hot tier
  - 30-90 days: warm tier
  - 90+ days: cold tier
- Examples: S3 Lifecycle, Azure Blob lifecycle

**2. Application-aware tiering**:
- App moves data based on access pattern
- More flexible than time-based
- Requires code

**3. Auto-tiering (smart)**:
- Storage system observes access patterns
- Automatically moves between tiers
- Example: S3 Intelligent-Tiering

**4. Database-level tiering**:
- Separate hot/cold tables/partitions
- Recent records in fast storage; old in archive
- Some DBs support natively (BigQuery, Snowflake)

**Database hot/cold patterns**:

**Time-series partitioning**:
- Partition by date
- Recent partition: SSD
- Old partitions: cheaper storage or archived

**Sharding by access**:
- Active users on premium DB
- Inactive users on cheaper DB

**Read-replica + archive**:
- Primary handles current data
- Older data archived to cheaper system (queryable)

**Cost considerations**:

**S3 example pricing** (illustrative):
- S3 Standard: \$0.023/GB/month
- S3 Standard-IA: \$0.0125/GB/month (~50% cheaper)
- S3 Glacier Instant Retrieval: \$0.004/GB/month (~80% cheaper)
- S3 Glacier Deep Archive: \$0.00099/GB/month (~95% cheaper)

But: retrieval costs!
- S3 Standard: free retrieval
- IA: \$0.01/GB retrieval
- Glacier: \$0.03/GB
- Deep Archive: \$0.02/GB + 12-hour delay

**Trade-off**: Cold tiers cheap to STORE, expensive to RETRIEVE. Suitable for "rarely accessed".

**Glacier retrieval modes**:
- Expedited: 1-5 minutes (most expensive)
- Standard: 3-5 hours
- Bulk: 5-12 hours (cheapest)

**Common pitfall**: Move data to cold without considering retrieval costs. If actually accessed often, total cost ends up HIGHER than hot storage.

**Compression and deduplication**:
- Often applied at colder tiers (more time available)
- 2-10× space savings

**Real-world tier strategy**:

**Logs**:
- 0-7 days: Elasticsearch (hot search)
- 7-30 days: S3 Standard (queryable via Athena)
- 30+ days: S3 Glacier (compliance)

**E-commerce**:
- Product catalog: hot (always served)
- Recent orders (last 90 days): hot (customer service)
- Old orders: warm
- 7+ year retention (tax/audit): cold

**Video streaming**:
- Recent / popular content: hot CDN
- Long tail: warm storage
- Archive of old shows: cold

**User photos**:
- Recent uploads: hot
- 1+ year old: warm
- Years old, rarely viewed: cold

**Modern approaches**:

**S3 Intelligent-Tiering**: Automatic. AWS observes access; moves between frequent/infrequent/archive automatically.

**HDFS / data lakes**: Hot data on SSD nodes; cold on HDD.

**Snowflake / BigQuery**: Internally tiered; users don't manage. Old data auto-archived.

## Real-World Example
**Email service**: Inbox (recent emails) on hot storage. Older than 1 year: warm. Older than 5 years (rarely accessed): cold tier. User accessing old email: brief delay, retrieved from cold tier.

**Compliance archive**: Bank stores transaction records for 7 years (regulation). Active records: hot. After 90 days: warm. After 1 year: Glacier Deep Archive. Cost: pennies per GB/month for years 2-7.

**Analytics**:
- Last 30 days of clickstream: ClickHouse (very hot, fast queries)
- Last year: S3 Parquet, queryable via Athena
- Older: Glacier (compliance only, rarely queried)

## Interview Tips
- "Hot = fast/expensive; cold = slow/cheap"
- Lifecycle policies are the standard cloud mechanism
- Retrieval costs can negate cold-tier savings if actually used
- S3 Intelligent-Tiering is modern auto-managed
- Time-based partitioning is a common pattern

## Common Follow-up Questions
1. When NOT to use cold storage? (When data accessed often — retrieval costs)
2. How move data between tiers? (Lifecycle policies, app logic, or auto-tiering)
3. What's archival vs cold? (Archival: longer retrieval times, cheaper still)`,
    'Data Lake vs Data Warehouse': `## Definition
A **data warehouse** stores structured, processed data optimized for SQL analytics on schema-on-write data. A **data lake** stores raw data of any kind (structured, semi-structured, unstructured) at low cost using schema-on-read. They serve different purposes; modern architectures often combine both ("lakehouse").

## Why It Matters
Choosing the right approach affects cost, flexibility, and the kinds of analytics you can do. Understanding the differences is essential for data architecture decisions.

## Detailed Explanation

**Data Warehouse**:

**Characteristics**:
- Structured data, defined schema (relational tables)
- Schema-on-write (data must conform on ingest)
- Optimized for SQL queries / BI tools
- ETL pipelines: transform before load
- Fast querying via columnar storage, indexes
- Higher cost per GB

**Examples**: Snowflake, BigQuery, Redshift, Synapse, Teradata.

**Use cases**:
- Business intelligence dashboards
- Financial reporting
- Customer analytics
- Aggregated metrics
- Standard SQL queries

**Data Lake**:

**Characteristics**:
- Raw data, any format (CSV, JSON, Parquet, images, videos, logs)
- Schema-on-read (interpret schema at query time)
- Cheap object storage (S3, ADLS, GCS)
- ELT: load first, transform later (or never)
- Flexible: data scientists can explore raw data
- Lower cost per GB

**Examples**: S3 + Athena/Spark, Azure Data Lake, GCS + BigQuery external tables.

**Use cases**:
- Raw event/log storage
- Machine learning datasets (need raw data for feature engineering)
- Historical archives
- Data exploration before knowing schema
- Multi-modal data (text, images, video)

**Comparison**:

| Aspect | Data Warehouse | Data Lake |
|--------|----------------|-----------|
| Data type | Structured | Any |
| Schema | On write | On read |
| Storage cost | High | Low |
| Query speed | Fast | Variable |
| Ingest complexity | High (ETL) | Low (just dump) |
| Users | Analysts, BI | Data scientists, ML |
| Tools | SQL, BI | Spark, Python, SQL |

**ETL vs ELT**:

**ETL (Extract, Transform, Load)**:
- Transform during pipeline
- Load clean data into warehouse
- Traditional approach

**ELT (Extract, Load, Transform)**:
- Load raw data first
- Transform in target (lake or warehouse)
- Modern approach with cloud's cheap compute and storage

**Data Lake challenges**:

**1. Data swamps**: Lake fills with undocumented data; nobody knows what's there. Solutions: data catalogs (AWS Glue, Apache Atlas).

**2. Data quality**: No enforcement on write; consumers deal with messiness.

**3. Performance**: Querying raw files (CSV, JSON) is slow. Solution: columnar formats (Parquet, ORC).

**4. Governance**: Hard to track lineage, access control over many files.

**Data Warehouse challenges**:

**1. Schema rigidity**: Adding fields requires migration.

**2. Cost at scale**: Storage premium adds up.

**3. Doesn't fit unstructured**: Images, video, free text.

**4. Latency for ETL**: Data not query-ready immediately.

**Lakehouse** (modern hybrid):

**Concept**: Combine flexibility of data lake with reliability/performance of warehouse.

**Approach**:
- Store data in lake (cheap object storage)
- Use formats with ACID guarantees (Delta Lake, Apache Iceberg, Apache Hudi)
- Query directly with SQL via engines like Databricks, Trino, BigQuery external tables

**Pros**:
- Single source of truth
- Cost-effective storage
- Supports both analytics and ML
- ACID transactions on lake

**Cons**:
- Maturing technology
- Vendor differences in implementations

**Architecture pattern (modern)**:

**Bronze / Silver / Gold layers**:
- **Bronze**: Raw ingest (data lake)
- **Silver**: Cleaned, validated, conformed
- **Gold**: Business-ready aggregates (warehouse-like)

Same underlying storage; progressive refinement.

**Storage formats**:

**Parquet**:
- Columnar
- Compressed
- Efficient for analytic queries
- Standard in lakes

**ORC**: Similar to Parquet; common in Hadoop ecosystem.

**Avro**: Row-based; good for streaming/serialization.

**Delta Lake / Iceberg / Hudi**:
- Add ACID, time travel, schema evolution to Parquet on lakes
- Foundation of lakehouse

**Modern data pipeline example**:

\`\`\`
Sources → Kafka (events) → S3 raw zone (Bronze, JSON)
                            ↓ (Spark / dbt)
                          S3 silver zone (Parquet, cleaned)
                            ↓ (transform)
                          S3 gold zone (aggregates)
                            ↓
                          Warehouse (Snowflake) for BI
                          + ML training (raw lake data)
\`\`\`

**OLTP vs OLAP**:

**OLTP** (transactions): Relational DBs (PostgreSQL, MySQL). Many small queries.

**OLAP** (analytics): Warehouses (Snowflake, BigQuery). Few large queries.

Lakes/warehouses are OLAP systems.

**Cost comparison** (rough, illustrative):

| Storage | Cost / TB / Month |
|---------|-------------------|
| S3 Standard | ~\$23 |
| Snowflake | ~\$23 (storage) + \$1-3/credit (compute) |
| BigQuery | ~\$20 (storage) + ~\$5/TB scanned |

Lake storage is cheap; compute pricing matters more for warehouses.

## Real-World Example
**Modern enterprise**:
- Data lake (S3) holds: clickstream JSON, app logs, ML training data, archived transactional data
- Warehouse (Snowflake) holds: cleaned dimensional models, finance data, BI marts
- Lakehouse approach: use Iceberg on S3, query directly via Athena/Trino — bypassing warehouse for many queries
- Cost: 1/10th of all-warehouse approach for the bulk data; warehouse for hot dashboards

**Netflix data architecture**: Massive S3 data lake. Spark/Iceberg/Trino for analytics. Pre-aggregated key metrics in Druid for low-latency dashboards.

**Banking**:
- Operational DB (DB2, Oracle) for transactions (OLTP)
- Warehouse for risk analytics, regulatory reporting
- Lake for ML, fraud detection, archival

## Interview Tips
- Warehouse = structured, expensive, fast for SQL; Lake = anything, cheap, flexible
- Schema-on-read (lake) vs schema-on-write (warehouse)
- ETL vs ELT
- Lakehouse = modern hybrid (Delta, Iceberg)
- Bronze/silver/gold pattern

## Common Follow-up Questions
1. ETL vs ELT? (Transform before vs after loading; ELT modern with cheap cloud compute)
2. What's a data swamp? (Lake gone wrong: undocumented, low quality)
3. Why lakehouse? (Best of both: lake's flexibility, warehouse's reliability)`,

    'ACID vs BASE (System Design)': `## Definition
**ACID** (Atomicity, Consistency, Isolation, Durability) describes the guarantees of traditional relational databases — strong consistency for transactions. **BASE** (Basically Available, Soft state, Eventual consistency) describes the looser guarantees of many NoSQL/distributed systems — high availability at the cost of immediate consistency. They represent the two ends of the consistency-availability trade-off.

## Why It Matters
This distinction shapes database choice and system design. ACID systems are easy to reason about but limited in scale; BASE systems scale but require careful design around eventual consistency.

## Detailed Explanation

**ACID** (recap):

**A — Atomicity**: All operations in a transaction succeed or none do. No partial state.

**C — Consistency**: Database moves from one valid state to another. All constraints (FK, CHECK) satisfied.

**I — Isolation**: Concurrent transactions don't interfere. Often via locking or MVCC.

**D — Durability**: Committed data survives crashes (write to disk, replicate).

**Typical ACID systems**: PostgreSQL, MySQL InnoDB, Oracle, SQL Server, SQLite.

**BASE**:

**BA — Basically Available**: System is mostly up; responds to requests (possibly with stale data).

**S — Soft state**: System state may change over time even without input — replicas converge.

**E — Eventual consistency**: All nodes converge to same state eventually, given no new writes.

**Typical BASE systems**: DynamoDB, Cassandra, CouchDB, Riak, S3 (historically), DNS.

**Comparison**:

| Aspect | ACID | BASE |
|--------|------|------|
| Consistency | Strong | Eventual |
| Availability | May sacrifice | Maximize |
| Scale | Vertical (limited) | Horizontal (massive) |
| Use case | Transactions, money, critical | Social, analytics, high-volume |
| Conflicts | Avoided via locks | Resolved (LWW, CRDTs, app logic) |
| Complexity for app | Low (simple model) | High (handle staleness) |
| Failure mode | Refuse vs serve stale | Serve stale vs refuse |

**Why ACID exists**:
- Bank transfers need atomicity (don't lose money in middle)
- Inventory needs isolation (don't oversell)
- Long history; well-understood; mature tooling

**Why BASE exists**:
- ACID at scale is expensive (consensus, locks, sync)
- Many use cases tolerate staleness
- Web-scale workloads (Amazon, Facebook) needed alternatives
- Networks fail (CAP theorem) — can't have all of C+A+P

**ACID-aware NoSQL**:
- Modern "NoSQL" often offers ACID per-document or per-key
- MongoDB: multi-document ACID since 4.0
- DynamoDB: transactional API for ACID across items
- The line between ACID and BASE is blurring

**BASE-aware SQL**:
- Distributed SQL (CockroachDB, Spanner) provide ACID across nodes
- Cost: latency for cross-region transactions
- Combine SQL semantics with horizontal scale

**When to use which**:

**Use ACID for**:
- Financial transactions
- Inventory / stock management
- Accounting / billing
- Authentication state
- Anything requiring strict invariants

**Use BASE for**:
- Social media feeds
- Analytics / metrics
- Caching
- Geo-distributed systems
- High-throughput logging
- Recommendation systems

**Hybrid approach** (most apps):
- Critical data in ACID (orders, payments)
- High-volume / non-critical in BASE (clickstreams, logs)
- Mix in same architecture

**Misconceptions**:

**1. "NoSQL = BASE"**: Not always. Many NoSQL DBs offer ACID modes.

**2. "ACID always = relational"**: NoSQL can have ACID; some SQL relaxes it.

**3. "Eventual consistency = bad"**: It's a deliberate trade-off; appropriate for many use cases.

**4. "ACID always slow"**: Not always; depends on workload, isolation level.

**Tunable consistency** (modern):
- Cassandra: per-query consistency level (ONE, QUORUM, ALL)
- DynamoDB: eventually consistent vs strongly consistent reads
- Cosmos DB: 5 consistency levels (Strong, Bounded Staleness, Session, Consistent Prefix, Eventual)
- Best of both: choose per use case

**Patterns**:

**Saga**: Distributed transactions without 2PC; eventual consistency with compensations.

**Outbox**: Atomic local commit + event emission for cross-service eventually consistent integration.

**Read-your-writes**: Soft consistency improvement for UX in BASE systems.

**Compare to CAP**:
- CAP: choose 2 of C, A, P (during partition)
- ACID emphasizes C
- BASE emphasizes A
- Both must handle P

## Real-World Example
**Banking**: ACID. Transfer between accounts atomic. Sees consistent state. Slow operations (some transfers take minutes for legacy reasons), but always correct.

**Twitter**: BASE. Your tweet appears to followers eventually. Like counts may differ briefly across viewers. Trades minor inconsistency for massive scale and uptime.

**E-commerce checkout** (hybrid):
- Order placement: ACID (charge card + decrement inventory atomically)
- Order tracking, recommendations: BASE (eventual is fine)

**Stack Overflow**: ACID — questions, answers, votes are transactional. Caching layer adds eventual consistency for performance.

**Modern example**:
- Spanner / CockroachDB: ACID at distributed scale (with latency cost)
- DynamoDB: BASE by default, ACID for explicit transactions

## Interview Tips
- "ACID = strong consistency, BASE = eventual"
- BASE designed for scale and availability
- Modern systems often hybrid
- ACID and BASE are not mutually exclusive — different parts of system can use each
- Tunable consistency is a modern third option

## Common Follow-up Questions
1. Why not always ACID? (Hard at scale; CAP forces availability trade-off)
2. Eventual consistency in practice? (Replicas converge; reads may be stale briefly)
3. Can NoSQL be ACID? (Yes — many modern NoSQL DBs offer ACID modes)`,

    'Throttling': `## Definition
**Throttling** is a flow-control technique that limits the rate of operations to prevent overload. It's similar to rate limiting but the response differs: rate limiting typically REJECTS excess requests; throttling SLOWS them (delays, queues, processes at reduced rate). Throttling is often a system's self-protection mechanism.

## Why It Matters
Without throttling, a system can be overwhelmed by traffic spikes, causing total failure. Smart throttling degrades gracefully — slower response is better than no response.

## Detailed Explanation

**Throttling vs rate limiting**:

| Aspect | Rate Limiting | Throttling |
|--------|---------------|------------|
| Response when excess | Reject (HTTP 429) | Slow down or queue |
| Goal | Quota enforcement | System protection |
| Visibility | User aware (gets 429) | Often invisible |
| Examples | API quotas | Database connection pool |

In practice, the terms are often used interchangeably.

**Where throttling appears**:

**1. Database connection pool**:
- Limit on concurrent connections
- Excess requests wait in queue
- Prevents DB overload

**2. Thread pools**:
- Bounded worker pool
- Excess work queued
- Protects CPU

**3. Network/IO**:
- TCP windowing throttles sender to receiver's speed
- File downloads with bandwidth limits

**4. APIs (combined with rate limiting)**:
- Some APIs slow down rather than reject when over limit
- Cloud APIs sometimes "throttle" with response delays

**5. Background jobs**:
- Process N items per second; queue rest

**6. Outbound calls**:
- Throttle calls to third-party API (respect their limits)

**Throttling techniques**:

**1. Bounded concurrency**:
- N concurrent operations max; rest wait
- Examples: connection pools, semaphores

**2. Queue-based**:
- Buffer between fast producer and slow consumer
- Process at consumer's rate

**3. Sliding window delay**:
- Track requests in window; if over rate, delay next response

**4. Exponential backoff**:
- Client-side: on rejection, wait increasing time before retry
- Server-side: reduce rate dynamically based on load

**5. Adaptive throttling**:
- Self-adjust based on observed health
- "Health budget" (Netflix): if errors high, throttle clients

**Throttling at multiple layers**:

**Edge / API gateway**:
- Per-user/IP limits
- Protects backends

**Service-level**:
- Per-API endpoint limits
- Different limits for cheap vs expensive ops

**Database**:
- Connection pool limit
- Query concurrency limits

**Worker / queue**:
- Max parallel jobs
- Rate of dequeue

**Common patterns**:

**Token bucket** (covered in Rate Limiting): bursts allowed.

**Leaky bucket**: smooths to constant rate.

**Backpressure**: signal upstream to slow down (covered separately).

**Concurrency control**:

**Semaphore**: 
\`\`\`python
import threading
sem = threading.Semaphore(10)  # max 10 concurrent

def call_api():
    with sem:
        response = requests.get(url)
        return response
\`\`\`
- 11th caller waits until one releases
- Simple, effective

**Connection pool**:
\`\`\`python
pool = ConnectionPool(max_size=20, timeout=5)
conn = pool.get_connection()  # may wait up to 5s
\`\`\`

**Cloud examples**:

**AWS Lambda concurrency limits**: Account-wide concurrent execution cap. Excess invocations throttled (queued for async; rejected for sync).

**DynamoDB read/write capacity**: Provisioned mode with throttle on excess. Auto-scaling adapts.

**S3 request rate**: ~3,500 PUTs and 5,500 GETs per prefix per second; spikes get 503s. Best practice: distribute key prefixes.

**Adaptive / self-protective throttling**:

**Netflix Hystrix / Resilience4j**:
- Bulkhead: limit concurrent calls to dependency
- Circuit breaker: stop calling unhealthy dep
- Together: self-protective + dep-protective

**TCP flow control**:
- Receiver advertises window size
- Sender doesn't exceed
- Built-in throttling at network layer

**Server overload behaviors**:

**Without throttling**:
- All clients see degraded performance (or full failure)
- Cascading failures
- Hard to recover (still under load while restarting)

**With throttling**:
- Some clients (or some operations) slowed/rejected
- Most clients still get good service
- System remains functional

**Trade-offs**:

**Pros**:
- Predictable behavior under load
- Protects critical paths
- Graceful degradation

**Cons**:
- Some users get worse experience
- Tuning is hard (too tight: leave capacity unused; too loose: doesn't protect)
- Adds complexity
- Backpressure can propagate badly

**Best practices**:
- Communicate limits (headers, error messages)
- Different priorities (premium users get more, batch jobs throttled)
- Different limits per operation type
- Monitor and alert on throttling
- Auto-scale capacity to reduce throttling need

## Real-World Example
**E-commerce site during sale**:
- Edge gateway throttles per-IP (prevent botting)
- Web tier autoscales but has hard cap
- Backend service uses semaphores to bound concurrent DB calls
- DB connection pool throttles queries
- Queue-based async order processing
- Result: graceful degradation; some queue, but no total failure

**Mobile API**:
- Per-app: 1000 req/min normal, 5000 burst (token bucket)
- Cron job endpoint: 10/min (cheap; allows scheduled use without abuse)
- Login endpoint: 5/min per IP (brute-force protection)

**Outgoing email**: Service throttles to 100 emails/sec to respect SES limits. Excess queued, processed gradually.

## Interview Tips
- Throttling = self-protection (slow down or queue)
- Different from rate limiting (reject)
- Multiple layers: edge, app, DB, network
- Bounded concurrency is fundamental technique
- Adaptive throttling responds to system health

## Common Follow-up Questions
1. Throttle vs rate limit? (Slow vs reject; often used together)
2. What's a connection pool? (Bounded set of DB connections; throttles concurrent queries)
3. How auto-throttle? (Observe metrics; reduce admission when system unhealthy)`,

    'Backpressure': `## Definition
**Backpressure** is a flow-control technique where a slow consumer signals an upstream producer to reduce its rate of production. Instead of buffering unbounded data (memory exhaustion) or dropping data (silent loss), the producer is told to slow down — propagating the constraint upstream.

## Why It Matters
Without backpressure, fast producers can overwhelm slow consumers, causing memory issues, queue overflow, or cascading failures. Backpressure is essential for resilient streaming and reactive systems.

## Detailed Explanation

**The core problem**:

\`\`\`
Producer (1000 events/sec) → Queue → Consumer (100 events/sec)
\`\`\`
- Queue fills up
- Without limit: out-of-memory, system crashes
- With drop policy: data loss
- With backpressure: producer slows to consumer's rate

**Strategies (when consumer can't keep up)**:

**1. Buffer (wait for space)**:
- Bounded queue; producer blocks when full
- Backpressure via blocking

**2. Drop (discard data)**:
- Drop newest, oldest, or lowest priority
- Acceptable for some workloads (sampling, monitoring)

**3. Throttle producer**:
- Signal producer to reduce rate
- Cleanest solution

**4. Aggregate / batch**:
- Combine items rather than processing individually
- E.g., aggregate metrics; coalesce updates

**Where backpressure manifests**:

**Network (TCP)**:
- TCP receive window — sender can't exceed
- Built-in backpressure

**HTTP/2**:
- Stream-level flow control (window updates)
- Receiver controls sender rate

**Reactive streams (RxJava, Project Reactor, Akka Streams)**:
- Built-in backpressure protocol
- Consumer requests N items; producer sends ≤ N

**Message queues**:
- Bounded queue + producer blocking
- Or rejection of new producers

**Streaming systems** (Flink, Kafka):
- Consumer-driven (pull)
- Slow consumer = unread messages pile up at broker
- Producer not directly affected (Kafka decouples)

**Reactive Streams specification**:
- Standard for async streams with backpressure
- Implementations: RxJava, Project Reactor, Akka Streams
- Consumer signals demand: \`request(n)\` — "I can handle n more items"
- Producer respects demand

**Push vs pull**:

**Push**: Producer pushes whenever it has data. Risk of overwhelming consumer.

**Pull**: Consumer requests when ready. Natural backpressure.

**Reactive Streams**: Hybrid — push, but bounded by consumer's request signal.

**Implementation patterns**:

**1. Bounded queue**:
\`\`\`python
queue = Queue(maxsize=100)
# Producer
def produce():
    while True:
        item = generate()
        queue.put(item)  # blocks if queue full
\`\`\`

**2. Consumer signals demand** (reactive):
\`\`\`
subscriber.request(10)  # "send me up to 10"
# producer sends; subscriber requests more when ready
\`\`\`

**3. Drop policies**:
\`\`\`
queue = Queue(maxsize=100, on_full=DropOldest)
\`\`\`

**4. Flow control protocol**:
- Custom protocol where consumer sends "window size"
- Producer respects window

**Trade-offs**:

**Block (wait)**:
- No data loss
- Latency increases
- Risk: deadlock if cyclic

**Drop**:
- Bounded latency
- Data loss
- Acceptable when data is sampled/redundant

**Buffer**:
- Smooths bursts
- Bounded buffer = bounded delay
- Unbounded = OOM risk

**Common pitfalls**:

**1. Unbounded buffers**: Hide problems; eventually crash.

**2. No timeouts**: Blocked producer waits forever.

**3. Cascading delays**: Slow consumer → upstream slows → upstream's upstream slows → entire pipeline jammed.

**4. Async/await without limits**: Spawning unlimited concurrent operations defeats backpressure.

**Backpressure in distributed systems**:

**Service-to-service**:
- HTTP 429 (Too Many Requests) signals client to back off
- Retry-After header tells how long
- Client implements exponential backoff

**Kafka**:
- Producers send to broker, which buffers
- Consumers pull at their own pace
- If consumers fall behind: lag accumulates
- Operator alerted; scale consumers
- Producer doesn't directly slow (decoupled)

**Streaming ETL** (Spark Structured Streaming, Flink):
- Backpressure detected via metrics (input rate vs processing rate)
- System auto-scales workers or signals upstream

**Programming model** (Reactive):
\`\`\`java
Flux.range(1, 1000)
    .onBackpressureBuffer(100)  // bounded buffer
    .delayElements(Duration.ofMillis(100))  // slow consumer
    .subscribe(System.out::println);
\`\`\`

Without onBackpressureBuffer, this crashes (overflow). With it, applies bounded buffer + drops or errors on overflow.

**Backpressure communication**:

**Pull-based**: Inherently — consumer pulls when ready.

**Push-based**: Need explicit signaling — request count, slow-down messages, error responses.

**Real-world examples**:

**Browser DevTools**: Network tab shows "blocked" requests when too many concurrent. Browser limits per-host (~6) and queues rest.

**OS pipe**: Default pipe size ~64KB. \`producer | consumer\` — if consumer slow, producer's writes block.

**Database write rate**: If DB can't keep up with inserts, app should slow producing — not buffer infinitely.

## Real-World Example
**Streaming analytics**:
- Kafka receives 10K events/sec
- Stream processor handles 1K/sec
- Without backpressure: lag accumulates, eventually OOMs
- With backpressure: scale consumers, or producer slowed, or events dropped per policy
- Operationally: alert on lag, autoscale

**Browser fetching**:
- HTML page references 500 images
- Browser limits to ~6 concurrent per host
- Other 494 wait — backpressure from HTTP-level concurrency limit

**Microservices**:
- Service A calls Service B; B is slow
- Without limits: A's threads pile up calling B
- With circuit breaker + bounded thread pool: A backs off, errors propagate up
- A's callers get errors, also back off — cascading backpressure

**Live video streaming**: When viewer's bandwidth drops, encoder lowers quality. Built-in backpressure via adaptive bitrate.

## Interview Tips
- Backpressure = slow consumer telling fast producer to slow down
- Without it: OOM or cascading failure
- Bounded queue + blocking is simplest
- Reactive Streams (Reactor, RxJava) bake it in
- Drop vs block vs buffer trade-offs

## Common Follow-up Questions
1. Why important? (Prevents OOM, cascading failures from fast→slow asymmetry)
2. Strategies? (Block, drop, throttle producer, batch/aggregate)
3. How implement in microservices? (Bounded thread pools, circuit breakers, HTTP 429 + Retry-After)`,

    'Health Checks': `## Definition
A **health check** is an endpoint or probe used by infrastructure (load balancers, orchestrators, monitoring) to determine if a service instance is healthy and ready to serve traffic. Health checks enable automatic detection and routing around failures, supporting high availability.

## Why It Matters
Without health checks, traffic gets routed to dead/unhealthy instances, causing user-visible failures. Good health checks enable self-healing systems; bad health checks cause flapping, false outages, or undetected failures.

## Detailed Explanation

**Types of health checks**:

**1. Liveness**:
- "Is this process alive?"
- Failure → restart the process
- Should detect deadlocks, unrecoverable states
- Should NOT depend on external services

**2. Readiness**:
- "Is this instance ready for traffic?"
- Failure → remove from LB, but DON'T restart
- Can depend on external services (DB connection, cache, etc.)
- True after warm-up, false during startup or graceful shutdown

**3. Startup probe** (Kubernetes):
- "Has this container started up?"
- Used during slow-starting apps
- After succeeds, switch to liveness/readiness

**Where they're used**:

**Load balancer**:
- Periodic health check (e.g., every 30s)
- Failed instances removed from rotation
- Healthy instances added back

**Kubernetes**:
- liveness probe → restart pod
- readiness probe → remove from Service endpoints
- startup probe → tolerate slow boot

**Auto-scaling group / orchestrator**:
- Replace failed instances
- Don't count unhealthy as serving capacity

**Monitoring**:
- Alert on health check failures
- Track availability metrics

**HTTP health endpoint**:

\`\`\`
GET /health → 200 OK (healthy)
                503 Service Unavailable (unhealthy)
                404 (no health endpoint — bad)
\`\`\`

**Simple implementation**:
\`\`\`python
@app.route("/health")
def health():
    return "OK", 200
\`\`\`
Just a 200 response. Tells you the process is responsive (basic).

**Better health endpoint** (deep):
\`\`\`python
@app.route("/health/ready")
def readiness():
    checks = {
        "db": check_db(),
        "cache": check_cache(),
        "downstream_api": check_downstream(),
    }
    if all(checks.values()):
        return jsonify(checks), 200
    return jsonify(checks), 503
\`\`\`
Reports each subsystem's status; returns 503 if any unhealthy.

**Configuration parameters**:

**Interval**: How often to check. Too frequent = overhead; too rare = slow detection. Common: 10-30s.

**Timeout**: How long to wait. Too short = false negatives (slow but healthy); too long = slow detection.

**Healthy threshold**: How many consecutive successes before marked healthy. Reduces flapping.

**Unhealthy threshold**: How many consecutive failures before marked unhealthy. 2-3 typical.

**Path**: \`/health\`, \`/healthz\`, \`/_status\`, \`/api/health\` — varies by convention.

**Anti-patterns**:

**1. Health check that's too shallow**:
- Just returns 200 without checking anything
- Doesn't detect actual problems
- App can be "healthy" while broken

**2. Health check that's too deep**:
- Checks all dependencies
- One downstream blip → all instances unhealthy → outage
- Specifically: deep liveness causes restart cascades

**3. Liveness depending on external services**:
- DB blip → all pods restart → don't recover
- Liveness should ONLY check internal process state

**4. Health checks that consume resources**:
- Health endpoint that hits DB on every check
- Consumes capacity; can hurt under load

**5. No graceful shutdown**:
- App receiving traffic during shutdown → connection errors
- Solution: readiness probe returns false during shutdown; LB drains connections

**6. No warm-up handling**:
- App starts but caches empty / connections still establishing
- Premature traffic → poor performance
- Solution: readiness probe false until warmed up

**Best practices**:

**Liveness**: Cheap, internal-only check. "Can I respond at all?" Don't check DB.

**Readiness**: Check critical dependencies. "Should I receive traffic?"

**Independent endpoints**: \`/healthz/live\` and \`/healthz/ready\` — different semantics.

**Graceful shutdown**:
1. Receive SIGTERM
2. Set readiness to false (LB stops sending traffic)
3. Wait for in-flight requests to complete
4. Close connections
5. Exit

**Reduce health check thrashing**:
- Use thresholds (2 failures before unhealthy)
- Use moving averages on metrics
- Don't fail on transient blips

**Synthetic monitoring**:
- External system periodically tests app from user perspective
- Different from infrastructure health checks
- E.g., Pingdom, AWS Synthetics

**Health check vs metrics**:
- Health: binary, infrastructure-actionable
- Metrics: granular, monitoring/alerting
- Different audiences

**Modern frameworks**:

**Kubernetes**:
- HTTP, TCP, or exec probes
- Configurable for liveness, readiness, startup
- Built-in graceful shutdown coordination

**Spring Boot Actuator**: Exposes \`/actuator/health\` with detailed component status.

**.NET**: Health Checks middleware; pluggable per-component checks.

**Service mesh**: Envoy can configure health checks for upstream clusters.

## Real-World Example
**E-commerce backend** (Kubernetes):
- Liveness: \`/health/live\` returns 200 if process not deadlocked. Restarts pod if fails 3× in 30s.
- Readiness: \`/health/ready\` checks DB connection pool, Redis ping, downstream auth service. Returns 503 if any fails. LB removes from rotation.
- Startup: 30s warm-up; after first /health/ready success, switches to normal probes.
- Graceful shutdown: 30s drain period; readiness false → no new requests → drain in-flight.

**AWS ALB target health**:
- HTTP health check every 30s
- Mark unhealthy after 2 failures
- Mark healthy after 2 successes
- Path: /api/health
- Failed targets get no traffic but EC2 instance not terminated

**Common pitfall fixed**: Liveness was checking DB. DB had 30s blip → all 50 pods restarted simultaneously → 5-minute total outage. Lesson: liveness should be process-only.

## Interview Tips
- Liveness vs readiness — different purposes
- Liveness: process-only checks
- Readiness: includes critical dependencies
- Graceful shutdown via readiness false
- Don't make health checks too deep — outage cascades

## Common Follow-up Questions
1. Liveness vs readiness? (Restart vs remove from LB; different scope)
2. Why not check DB in liveness? (DB blip → mass restart; cure worse than disease)
3. How handle graceful shutdown? (Readiness false → drain → exit)`,

    'Idempotency Keys': `## Definition
An **idempotency key** is a unique identifier (typically a UUID) that a client attaches to a request, allowing the server to deduplicate retried requests. If the server receives a request with a key it has seen before, it returns the cached response instead of processing the request again.

## Why It Matters
Idempotency keys are the standard pattern for safely retrying non-idempotent operations like payments. They turn POST (non-idempotent) into safely-retryable. Used by Stripe, AWS, and any robust API.

## Detailed Explanation

**The problem**:
- Client sends \`POST /payments\` to charge \$100
- Network fails before client receives response
- Client doesn't know if charge succeeded
- Retry → potentially DOUBLE charge

**The solution: idempotency key**:
- Client generates UUID once per logical operation
- Sends with request: \`Idempotency-Key: abc-123-uuid\`
- Server records seen keys; on duplicate, returns cached response
- Retries SAFE — only one charge regardless of retries

**How it works**:

\`\`\`
First request:
Client → POST /payments
         Idempotency-Key: abc-123
         body: {amount: 100, card: ...}

Server:
1. Check: was key abc-123 seen before? NO
2. Reserve key abc-123 (in DB or cache)
3. Process: charge card
4. Save response with key abc-123
5. Return response to client

Network fails; client doesn't get response.

Retry:
Client → POST /payments
         Idempotency-Key: abc-123  (same key!)
         body: {amount: 100, ...}

Server:
1. Check: was key abc-123 seen? YES
2. Return cached response (don't re-process!)
3. No second charge
\`\`\`

**Implementation considerations**:

**1. Storage**:
- Database table: idempotency_keys (key, response, expires)
- Redis: fast, with TTL
- Combined: Redis cache, DB persistent

**2. TTL**:
- Keys can't be stored forever
- Common: 24 hours
- After TTL: key reusable; same key after this = treated as new

**3. Race conditions**:
- Two simultaneous requests with same key
- Need atomic "insert if not exists"
- DB unique constraint or Redis SETNX

**4. Different requests, same key**:
- Same key, DIFFERENT body — ambiguous
- Best practices vary:
  - Compare hash of body; reject if differs
  - Or: assume client error; return error
  - Or: just return original response (less safe)

**5. In-progress handling**:
- First request still processing; retry arrives
- Wait for original to complete? Return "in progress"?
- Stripe: returns "request_in_progress" for repeated calls during processing

**6. Failed requests**:
- Original failed (5xx); retry sees same key
- Return same error? Re-attempt?
- Generally: cache the response (success or error); don't re-attempt
- Exception: transient errors might warrant a separate retry mechanism

**API design**:

**Request**:
\`\`\`
POST /payments
Idempotency-Key: <client-generated-uuid>
Content-Type: application/json

{"amount": 100, "currency": "usd", ...}
\`\`\`

**Response includes echo**:
\`\`\`
HTTP/1.1 200 OK
Idempotency-Key: <same key>

{"id": "pay_xyz", "status": "succeeded", ...}
\`\`\`

**Server-side pseudocode**:
\`\`\`python
def handle_payment(request):
    key = request.headers["Idempotency-Key"]
    if not key:
        return error("Idempotency-Key required")
    
    # Atomic: insert key, get response if exists
    cached = idempotency_table.get_or_insert(key, body_hash=hash(request.body))
    
    if cached.body_hash != hash(request.body):
        return error("Same key with different body")
    
    if cached.response:  # already processed
        return cached.response
    
    # Process
    try:
        result = process_payment(request.body)
        idempotency_table.set_response(key, result)
        return result
    except Exception as e:
        # Decide: cache error or allow retry?
        idempotency_table.set_error(key, str(e))
        raise
\`\`\`

**Client-side**:

**Generate UUID per logical operation**:
\`\`\`python
import uuid
key = str(uuid.uuid4())  # generate ONCE

# Retry loop
for attempt in range(3):
    try:
        response = requests.post(url, json=body, headers={"Idempotency-Key": key})
        if response.ok:
            return response
    except:
        pass  # retry with SAME key
    time.sleep(2 ** attempt)  # exponential backoff
\`\`\`

**Critical**: Use SAME key across retries of SAME logical operation. Never generate new key on retry — defeats the purpose.

**Different operations need different keys**:
- Two distinct payments → two different keys
- Same key reuse = "same operation" = no double-charge

**Where used**:

**Stripe**: Idempotency-Key header. 24-hour retention. Required for safe payment retries.

**AWS**: Many APIs accept ClientToken or similar. RunInstances, CreateBucket, etc.

**Google Cloud**: requestId parameter for similar purpose.

**Internal APIs**: Pattern is widely adopted for payment, order, transfer endpoints.

**Beyond payments**:
- Order placement
- Money transfers
- Email sending (don't email twice)
- Resource creation
- Anything where duplicate execution is harmful

**Common pitfalls**:

**1. New UUID each retry**: Defeats idempotency.

**2. No atomic check-and-insert**: Two simultaneous attempts both pass "not exists" check; both process.

**3. Caching errors but should retry**: Distinguish transient (retry) from permanent (cache).

**4. Storing forever**: Keys grow unboundedly. Set TTL.

**5. Sensitive data in cached response**: Long-lived response cache may leak data; encrypt or redact.

**6. Idempotency for read endpoints**: Reads are already idempotent (GET). Don't need keys.

## Real-World Example
**Stripe payment**:
\`\`\`
POST https://api.stripe.com/v1/payment_intents
Idempotency-Key: 23048234ab43-payment-january
Authorization: Bearer ...
\`\`\`
Network fails on first try; client retries with same key. Stripe returns same payment_intent — no double charge.

**E-commerce checkout**: 
- User clicks "Place Order"; UI generates UUID
- API call uses UUID as idempotency key
- User double-clicks: second request sees same key, returns first order
- One order placed, even with duplicate clicks or network issues

**AWS RunInstances**:
\`\`\`
POST /
Action=RunInstances
ClientToken=<uuid>
\`\`\`
- Launches instance idempotently
- Retry → same instance (not a new one)

## Interview Tips
- Idempotency key = client-side UUID for deduplication
- Server caches response per key
- Same key across retries (essential!)
- 24h TTL typical
- Handle: same key + different body, in-progress, failures
- Stripe is the canonical example

## Common Follow-up Questions
1. Why client-generated UUID? (Stable across retries; client knows it's the same operation)
2. What if same key but different body? (Server should reject; signals client bug)
3. How long retain keys? (Long enough to outlive normal retry windows; 24h common)`,
  }
};

module.exports = detailedAnswers;
