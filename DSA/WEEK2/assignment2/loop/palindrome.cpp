#include <iostream>
using namespace std;

int main() {
    long long N;
    cin >> N;

    long long original = N;
    long long rev = 0;

    while (N > 0) {
        rev = rev * 10 + (N % 10);
        N /= 10;
    }

    if (original == rev)
        cout << "YES";
    else
        cout << "NO";

    return 0;
}
