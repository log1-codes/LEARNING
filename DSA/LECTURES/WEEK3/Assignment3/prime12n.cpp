#include <iostream>
using namespace std;

int factor(int n) {
    int count = 0;
    for (int i = 1; i <= n; i++) {
        if (n % i == 0) {
            count++;
        }
    }
    return count;
}

bool isPrime(int n) {
    if (n < 2) return false;

    int result = factor(n);
    return result == 2;  
}

int main() {
    int N = 10;
    cin >> N;
    for (int i = 1; i <= N; i++) {
        if (isPrime(i)) {
            cout << i << " ";
        }
    }

    return 0;
}
