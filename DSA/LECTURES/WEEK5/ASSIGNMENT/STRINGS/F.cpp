#include <bits/stdc++.h>
using namespace std;

int main() {
    string A, B;
    cin >> A >> B;

    if (A == B) {
        cout << "Equal";
    }
    else if (A < B) {
        cout << "A";
    }
    else {
        cout << "B";
    }

    return 0;
}
