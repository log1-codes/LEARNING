#include <iostream>
using namespace std;

int hcf(int A, int B) {
    while (B != 0) {
        int rem = A % B;
        A = B;
        B = rem;
    }
    return A;
}

int main() {
    int A, B;
    cin >> A >> B;
    cout << hcf(A, B);

    return 0;
}
